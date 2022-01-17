
const {Question} = require('../Model/db.js');
const {AnswerPhotosAggregate} = require('../Model/db.js');
const redisClient = require('redis').createClient;
const redis = redisClient(6379, 'localhost');

let fetchAllAnswersAndPhotos = function(questionId,endPoint){
  return new Promise((resolve, reject) => {

    AnswerPhotosAggregate.find({question_id:questionId}, /*{id: 1, body: 1, date: 1, answerer_name: 1, helpfulness: 1, photos: 1},*/(err, answersAndPhotos) => {
      if(err) {
        reject(err)
      }else {
       var answers = [];
        for(var i=0; i<answersAndPhotos.length; i++) {
          var answerObj = {};
          answerObj.id = answersAndPhotos[i].id;
          answerObj.answer_id = answersAndPhotos[i].id;
          answerObj.body = answersAndPhotos[i].body;
          answerObj.answerer_name = answersAndPhotos[i].answerer_name;
          answerObj.helpfulness =  answersAndPhotos[i].helpfulness;
          answerObj.date = answersAndPhotos[i].date;
          answerObj.photos = [];
       if(endPoint === 'answers') {
        for(var photo of answersAndPhotos[i].photos) {
          var newPhoto = {};
          newPhoto.id = photo.id;
          newPhoto.url = photo.url;
          answerObj.photos.push(newPhoto);
        }
       }else {
        for(var photo of answersAndPhotos[i].photos) {
          answerObj.photos.push(photo.url);
        }
       }

        answers.push(answerObj);
       }
       resolve(answers);

      }
    })
  });

 }
let newQuestionsForProduct = function(productId) {
  return new Promise((resolve, reject) => {
    var questionsArray = [];

    if(productId === undefined) {
      reject(new Error('No product Id passed'));
    }
    Question.find({product_id:productId}, (err,questions) => {

      if(err) {
        reject(err)
      }else {

        for(var i=0; i < questions.length; i++) {
          var questionObj = {};
          questionObj.question_id = questions[i].question_id;
          questionObj.asker_name = questions[i].asker_name;
          questionObj.reported = questions[i].reported;
          questionObj.question_date = questions[i].question_date;
          questionObj.question_helpfulness = questions[i].question_helpfulness;
          questionObj.question_body =  questions[i].question_body;
          questionObj.answers = {};
          questionsArray.push(questionObj);
        }
        resolve(questionsArray);
      }
    });
  });
}
/*let questionsForProduct = function(productId) {
 //console.log("inside questions for product");
  return new Promise((resolve, reject) => {
    var resultObj = {};
    resultObj.product_id = productId;
    resultObj.results = [];
    if(productId === undefined) {
      reject('No product Id passed');
    }
    Question.find({product_id:productId}, (err,questions) => {
      if(err) {
        reject(err)
      }else {
        var fetchAnswersArray = [];

        for(var i=0; i<questions.length; i++) {

         fetchAnswersArray.push(fetchAllAnswersAndPhotos(questions[i].question_id))
        }
        Promise.all(fetchAnswersArray)
        .then((answersWithPhotos) => {
          //console.log(answersWithPhotos);


           for(var i=0; i < questions.length; i++) {

             var questionObj = {};
             questionObj.question_id = questions[i].question_id;
             questionObj.asker_name = questions[i].asker_name;
             //questionObj.asker_email = questions[i].asker_email;
             questionObj.reported = questions[i].reported;
             questionObj.question_date = questions[i].question_date;
             questionObj.question_helpfulness = questions[i].question_helpfulness;
             questionObj.question_body =  questions[i].question_body;

             var answers = answersWithPhotos[i].slice(0);

             questionObj.answers = {};
             for(var j=0; j<answers.length; j++) {
               var photos = answers[j].photos.slice(0);
               var newPhotos = [];
               for(var photo of photos){
                newPhotos.push(photo.url)
               }
               answers[j].photos = newPhotos.slice(0);
               let property = answers[j].id;
               questionObj.answers[property] = answers[j];

             }

             //console.log(questionObj);
             resultObj.results.push(questionObj);


           }
          //console.log(resultObj);

           resolve(resultObj);
      })
      .catch((error) => {
        reject(error);
      });
    }
  });

});
}*/
/*fetchAllAnswersForQuestion(34)
.then((data) => {
  console.log(data)
})
.catch((error) => {
   console.log(error)
})*/
/*fetchAllQuestionsForProduct(10)
.then((data) => {
  console.log('data',data);
})
.catch((error) => {
  console.log(error)
})*/
/*questionsForProductWithAggregate(34)
.then((data) => {
  console.log('data:',data)
})
.catch((error) => {
   console.log(error)
})*/


module.exports ={

  fetchAllAnswersAndPhotos:fetchAllAnswersAndPhotos,
  //questionsForProduct:questionsForProduct,
  newQuestionsForProduct:newQuestionsForProduct
}