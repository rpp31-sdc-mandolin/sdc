


//const newRelic = require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');

//const redisClient = require('redis').createClient;
//const redis = redisClient(6379, 'localhost');

//const {createClient} = require('redis');

const {questionsForProduct} = require('../Controllers/fetch.js');
const {fetchAllAnswersAndPhotos} = require('../Controllers/fetch.js');
const {questionInsert} = require('../Controllers/insert.js');
const {answerPhotoAggregateInsert} = require('../Controllers/insert.js');
const {newQuestionsForProduct} = require('../Controllers/fetch.js');
const update = require('../Controllers/update.js');

//const cluster = require("cluster");
//const totalCPUs = require("os").cpus().length;
const app = express();




app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use(compression());
app.use(express.json());


app.get('/loaderio-e1a379d5ae1ab55e00ac09de2157adf7.txt', (req,res) => {
  //console.log('inside /loaderio-1097babe155844fe52afbdd34f557993.txt');
  res.status(200);
  res.set('Content-Type', 'text/plain');
  res.send('loaderio-e1a379d5ae1ab55e00ac09de2157adf7');
});





app.get('/qa/questions999/', (req,res) => {
  res.set({'content-type':'application/json'});
  res.status(200).send(`{
    "product_id": "34",
    "results": [
        {
            "question_id": 116,
            "asker_name": "Cassandre.McCullough35",
            "reported": false,
            "question_date": "2020-10-03T13:12:21.189Z",
            "question_helpfulness": 3,
            "question_body": "Culpa occaecati placeat labore autem odit aliquid.",
            "answers": {
                "228": {
                    "id": 228,
                    "answer_id": 228,
                    "body": "Consequatur labore et.",
                    "answerer_name": "Rico.Langworth",
                    "helpfulness": 13,
                    "date": "2020-11-06T01:41:15.734Z",
                    "photos": []
                },

                "20220202321741": {
                    "id": 20220202321741,
                    "answer_id": 20220202321741,
                    "helpfulness": 0,
                    "date": "2022-01-20T02:32:17.044Z",
                    "photos": []
                }
            }
        },
        {
            "question_id": 118,
            "asker_name": "Orlando_Haag",
            "reported": false,
            "question_date": "2020-12-09T10:19:35.812Z",
            "question_helpfulness": 19,
            "question_body": "Hic amet in est corrupti quod ratione.",
            "answers": {
                "231": {
                    "id": 231,
                    "answer_id": 231,
                    "body": "Iste cum aperiam ut aliquam neque necessitatibus.",
                    "answerer_name": "Jerrell.Kling75",
                    "helpfulness": 1,
                    "date": "2020-05-21T14:49:04.762Z",
                    "photos": []
                },
                "232": {
                    "id": 232,
                    "answer_id": 232,
                    "body": "Ex eius earum vitae cupiditate quasi officia omnis et.",
                    "answerer_name": "Evan65",
                    "helpfulness": 17,
                    "date": "2020-08-07T10:28:44.561Z",
                    "photos": []
                }
            }
        },
        {
            "question_id": 117,
            "asker_name": "Trent78",
            "reported": false,
            "question_date": "2021-02-10T15:12:34.884Z",
            "question_helpfulness": 21,
            "question_body": "Laudantium eos laudantium non eos sit sed doloremque est.",
            "answers": {}
        }
    ]
}`)
})

/*app.get('/qa/questions/', (req,res)=>{
 //console.time('fetchQuestions');
  var product_id = req.query.product_id;
  var resultObj = {};
  resultObj.product_id = product_id;
  resultObj.results = [];

      newQuestionsForProduct(product_id,'questions')
      .then((questions) => {
          console.log('questions:',questions);
          resultObj.results.push(questions);

              res.statusCode = 200;
              res.send((resultObj));

        })
        .catch((error) => {
          res.statusCode = 404;
          res.send(error);
        })

      });

   // }
  //})


  //})();
  /*redis.get(product_id, (err, reply) =>{
    if(reply) {
      res.statusCode = 200;
      res.send((JSON.parse(reply)));
    } else  if(err && !reply){
      console.log('error', err)*/


//});*/
app.get('/qa/questions/', (req,res)=>{
  //console.time('fetchQuestions');
  var product_id = req.query.product_id;
  var resultObj = {};
  resultObj.product_id = product_id;
  resultObj.results = [];
  /*(async () => {
    const client = createClient();
    client.on('error',(err) => console.log('Redis Client err',err));
    await client.connect();
    const questionsAndAnswersData = await client.get(product_id);
    if(questionsAndAnswersData) {
      res.statusCode = 200;
      res.send((JSON.parse(questionsAndAnswersData)));
      console.timeEnd('fetchQuestions');
    } else {*/
      newQuestionsForProduct(product_id,'questions')
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
            /*(async() => {
              await client.set(product_id, JSON.stringify(resultObj));*/
              res.statusCode = 200;
              res.send((resultObj));
              //console.timeEnd('fetchQuestions');
           // })();

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
  //console.timeEnd('fetchQuestions');
  });

  //})();
  /*redis.get(product_id, (err, reply) =>{
    if(reply) {
      res.statusCode = 200;
      res.send((JSON.parse(reply)));
    } else  if(err && !reply){
      console.log('error', err)*/


//});
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

app.get('/loaderio-1097babe155844fe52afbdd34f557993.txt', (req,res) => {
  console.log('inside /loaderio-1097babe155844fe52afbdd34f557993.txt');
  res.status(200);
  res.set('Content-Type', 'text/plain');
  res.send('loaderio-1097babe155844fe52afbdd34f557993');
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


