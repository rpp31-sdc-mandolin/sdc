

//const {Answer} = require('./db.js');
const {Question} = require('../Model/db.js');
//const {AnswersPhotos} = require('./db.js');
const {AnswerPhotosAggregate} = require('../Model/db.js');

//to get the next Id to insert data
const getNextId = (db) => {
  return new Promise ((resolve, reject) => {

     db.findOne().sort({id:-1}).exec(function(err, item) {
      if(db === Question) {
       // console.log(item.question_id+1);
        resolve(item.question_id+1)
       } else {
        //console.log(item.id+1);
        resolve(item.id+1)
       }

    });

  });
}
/*getNextId(AnswersPhotos)
.then((data) => {
  console.log('data', data);
})
.catch((error) => {
  console.log('error', error);
})*/


const questionInsert = (questionData, callback) => {
  let id;
  let question={};
  getNextId(Question)
  .then((nextId) => {

      id = nextId;
      question.question_id =  id;
      question.product_id = questionData.product_id;
      question.question_body = questionData.body;
      question.question_date = new Date();
      question.asker_name = questionData.name;
      question.asker_email = questionData.email;
      question.reported = false;
      question.question_helpfulness = 0;
      console.log('question:',question);
      let newQ = new Question(question);
      console.log('newQ:',newQ);
      newQ.save((err) => {
        if(err){
         return err;

        } else {
          callback(null, "CREATED")
        }
      })
  })
  .catch((error) => {
    console.log('error', error);
    callback(error);
  })
}
/*const answerInsert = (answerData, question_id, callback) => {
  let id;
  let answer;
  getNextId(Answer)
  .then((nextId) => {

      id = nextId;
      answer.id = id;
      answer.question_id = question_id;
      answer.body = answerData.body;
      answer.answerer_email = answerData.email;
      answer.answerer_name = answerData.name;
      answer.date = new getDate();
      answer.reported = false;
      answer.helpfulness = 0;
      let newAnswer = new Answer(answer);
      newAnswer.save((err) => {
        if(err){
         return err;

        } else {
          if(answerData.photos !== undefined  && answerData.photos.length > 0) {
            answerPhotoInsert(answerData.photos, (err,data) => {
              if(err) {
                console.log(err)
              }else{
                console.log(data);
                callback(null, "CREATED");
              }
            })
          }else {
            callback(null, "CREATED");
          }


        }
      })
  })
  .catch((error) => {
    console.log('error', error);
    callback(error);
  })
}*/
/*const answerPhotoInsert = (photoData, callback) => {
  let id;
  getNextId(AnswersPhotos)
  .then((nextId) => {

      id = nextId;
      photoData.id = id;

      let newPhoto = new AnswersPhotos(photoData);
      newPhoto.save((err) => {
        if(err){
         return err;

        } else {
          callback(null, "AnswerPhoto successfully saved")
        }
      })
  })
  .catch((error) => {
    console.log('error', error);
    callback(error);
  })
}*/
const answerPhotoAggregateInsert = function(answerData, question_id, callback) {
  let id;
  let answer = {};
  getNextId(AnswerPhotosAggregate)
  .then((nextId) => {
      console.log('answerData:',answerData);
      id = nextId;
      answer.id = id;
      answer.question_id = question_id;
      answer.body = answerData.body;
      answer.answerer_email = answerData.email;
      answer.answerer_name = answerData.name;
      answer.date = new Date();
      answer.reported = false;
      answer.helpfulness = 0;
      answer.photos = [];
      if(answerData.photos !== undefined && answerData.photos.length > 0) {
        for(var i=1; i<=answerData.photos.length; i++) {
          var photoObj = {};
          photoObj.id = i;
          photoObj.url = answerData.photos[i].url;
          photoObj.answer_id = answer.id;
          answer.photos.push(photoObj);
        }
      }

      let newAnswer =new AnswerPhotosAggregate(answer);
      newAnswer.save((err) => {
        if(err){

         callback(err);
        } else {

          callback(null, "CREATED");
        }
      });
  });
}
/*var questionData = {
   product_id: 4,
    question_body: "Is this a good product?",
    asker_name: "Annu",
    reported: false,
    question_helpfulness: 4,
    question_date: new Date()
}*/


/*console.log(questionInsert(questionData, (err,data) => {
  if(data) {
    console.log('data:', data);
  }
}))*/

module.exports ={
  questionInsert: questionInsert,
  answerPhotoAggregateInsert:answerPhotoAggregateInsert
}