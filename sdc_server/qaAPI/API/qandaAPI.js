


const newRelic = require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');

const redisClient = require('redis').createClient;
const redis = redisClient(6379, 'localhost');

const {questionsForProduct} = require('../Controllers/fetch.js');
const {fetchAllAnswersAndPhotos} = require('../Controllers/fetch.js');
const {questionInsert} = require('../Controllers/insert.js');
const {answerPhotoAggregateInsert} = require('../Controllers/insert.js');
const {newQuestionsForProduct} = require('../Controllers/fetch.js');
const update = require('../Controllers/update.js');

const app = express();


app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use(compression());
app.use(express.json());



redis.on("connect", () => {
  console.log("connected to redis");
})
app.get('/qa/questions/', (req,res)=>{
  console.time('fetchQuestions');
  var product_id = req.query.product_id;
  var resultObj = {};
  resultObj.product_id = product_id;
  resultObj.results = [];

  /*redis.get(product_id, (err, reply) =>{
    if(reply) {
      res.statusCode = 200;
      res.send((JSON.parse(reply)));
    } else  if(err && !reply){
      console.log('error', err)*/
      newQuestionsForProduct(product_id)
      .then((questions) => {
        var fetchAnswersArray = [];

        for(var i=0; i<questions.length; i++) {

            fetchAnswersArray.push(fetchAllAnswersAndPhotos(questions[i].question_id,"questions"))
        }
        Promise.all(fetchAnswersArray)
        .then((answersWithPhotos) => {
          for(var i=0; i<questions.length; i++) {
            var newAnswers = answersWithPhotos[i].slice(0);
            for(var j=0; j< newAnswers.length; j++){
              questions[i].answers[newAnswers[j].id] = newAnswers[j];
            }
            resultObj.results.push(questions[i]);
          }
          //redis.set(product_id, JSON.stringify(resultObj), () => {
            res.statusCode = 200;
            res.send((resultObj));
            console.timeEnd('fetchQuestions');
          //})

        })
        .catch((error) => {
          res.statusCode = 404;
          res.send(error);
        })

      })
      .catch((error) => {
        res.statusCode = 404;
        res.send(error);
      })
   // }
  //})
  console.timeEnd('fetchQuestions');

});
app.get('/qa/questions/:question_id/answers', (req,res) => {
  console.time('fetchAnswers');

  var question_id = req.params.question_id;

  var resultObj = {};
  resultObj.question = question_id;
  fetchAllAnswersAndPhotos(question_id,'answers')
  .then((answersAndPhotos) => {
    resultObj.results = [];
     resultObj.results = answersAndPhotos.slice(0);
      //console.log(resultObj);
    res.statusCode = 200;
    res.send(resultObj);
    console.timeEnd('fetchAnswers');
  })
  .catch((error) => {
    res.statusCode = 404;
    res.send(error);
  })

});


app.post('/qa/questions/', (req,res) => {
  console.log('******* Here');
  console.log(req.body);
  var questionData = req.body;
  console.log(questionData);
  questionInsert(questionData, (err,data) => {
    if(err){
      console.log('err:',err);
      res.status(500).send(err)
    } else {
      console.log('err:',err);
      res.status(201).send('CREATED')
    }
  })


});
app.post('/qa/questions/:question_id/answers', (req,res) => {
  var answerData = req.body;
  var question_id = req.params.question_id;

  answerPhotoAggregateInsert(answerData, question_id, (err,data) =>{
    if(err) {
      res.status(500).send(err);

    }else {
      res.status(201).send('CREATED');

    }
  })
})
app.put('/qa/questions/:question_id/report', (req, res) => {
  var questionId = req.params.question_id;
  update.updateQuestionReport(questionId, (err,data) => {
    if(err) {
      res.status(404).send(err);

    } else {
      res.status(204).send();

    }
  })
});

app.put('/qa/answers/:answer_id/report', (req, res) => {

  var answerId = req.params.answer_id;
  update.updateAnswerReport(answerId)
  .then((data) => {
    res.status(204).send()

  })
  .catch((error) => {
    res.status(404).send(error);
  })
});
app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  var answerId = req.params.answer_id;
  update.updateAnswerHelpful(answerId)
  .then((data) => {
    res.status(204).send(data)
  })
  .catch((error) => {
    res.status(404).send(error);
  })
});
app.put('/qa/questions/:question_id/helpful', (req, res) => {
  var questionId = req.params.question_id;
  //console.log("REACHED HERE");
  //console.log('questionId', questionId);
  update.updateQuestionHelpful(questionId, (err,data) => {
    if(err) {
      res.status(404).send(err);

    } else {
      res.status(204).send();

    }
  })
});

module.exports = app;