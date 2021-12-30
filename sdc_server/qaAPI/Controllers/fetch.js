


//const {Answer} = require('../Model/db.js');

const {Question} = require('../Model/db.js');
//const {AnswersPhotos} = require('../Model/db.js');
const {AnswerPhotosAggregate} = require('../Model/db.js');


/*let questionsForProductWithOutAggregate = function(productId) {
  return new Promise((resolve, reject) => {
    var resultObj = {};
    resultObj.product_id = productId;
    Question.find({product_id:productId}, (err,questions) => {
       if(err) {
         reject(err)
       }else {
        // console.log("got the questions", questions);

         var fetchAnswersArray = [];
         for(var question of questions) {
          fetchAnswersArray.push(fetchAllAnswersForQuestion(question.question_id))
         }
         Promise.all(fetchAnswersArray)
         .then((answersWithPhotos) => {

            for(var i=0; i < questions.length; i++) {

              var answers = answersWithPhotos[i].results.slice(0);
              questions[i].answers = {};
              answers.forEach((answer) => {
                let property = answer.id;
                questions[i].answers[property] = answer;
              })


            }
            resultObj.results = questions.slice(0);
            //console.log('questions',questions[0]['97'].photos);
            //console.log('resultObj:',resultObj.questions[questions.length-1]);
            console.log('resultObj:',resultObj.results[questions.length-1].answers)
            resolve(resultObj);
         })

       }
    })
  })
}
let fetchAllAnswersForQuestion = function(questionId) {
  return new Promise((resolve, reject) => {


         var resultObj = {};
         resultObj.question = questionId;
         var  fetchPhotosForAnswerArray = [];
         console.log('questionId',questionId);
         Answer.find({question_id:questionId}, (error,answers) => {
            if(error) {
              reject(error)
            } else{
              //console.log("answers", answers);

              for(var answer of answers) {
                fetchPhotosForAnswerArray.push(fetchPhotosForAnswer(answer.id));
                answer.answer_id = answer.id;
              }
              //console.log('fetchPhotosForAnswerArray:',fetchPhotosForAnswerArray);
              Promise.all(fetchPhotosForAnswerArray)
              .then((photosArray) => {
                for(var i=0; i<answers.length; i++) {

                  answers[i].photos = photosArray[i].slice(0);
                 // console.log('answers['+i+']:',answers[i].photos);
                }

                resultObj.results = answers.slice(0);
               //console.log('resultObj photos',resultObj.results[0]._id);
                resolve(resultObj);
              })
              .catch((error) => {
                console.log('error', error);
                reject(error);
              })
            }
         })


  })
}
let fetchPhotosForAnswer = function(answerId){
  return new Promise((resolve, reject) => {

    AnswersPhotos.find({answer_id:answerId}, (error, photos) => {
      if(error) {
        reject(error)
      } else{

        resolve(photos);
      }
    })
  });
}
*/
 let fetchAllAnswersAndPhotos = function(questionId){
  return new Promise((resolve, reject) => {

    AnswerPhotosAggregate.find({question_id:questionId}, (err, answersAndPhotos) => {
      if(err) {
        reject(err)
      }else {

       resolve(answersAndPhotos);
      }
    })
  });

 }

let questionsForProduct = function(productId) {
  //console.log("inside questions for product");
  return new Promise((resolve, reject) => {
    var resultObj = {};
    resultObj.product_id = productId;
    resultObj.results = [];
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
             questionObj.asker_email = questions[i].asker_email;
             questionObj.reported = questions[i].reported;
             questionObj.question_date = questions[i].question_date;
             questionObj.helpfulness = questions[i].question_helpfulness;
             questionObj.question_body =  questions[i].question_body;

             var answers = answersWithPhotos[i].slice(0);

             questionObj.answers = {};
             for(var j=0; j<answers.length; j++) {
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
}
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
  questionsForProduct:questionsForProduct
}