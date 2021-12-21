

const {Answer} = require('./db.js');
const {Question} = require('./db.js');
const {AnswersPhotos} = require('./db.js');
const {AnswerPhotosAggregate} = require('./db.js');

//to get the next Id to insert data
const getNextId = (db) => {
  return new Promise ((resolve, reject) => {

     db.findOne().sort({id:-1}).exec(function(err, item) {

        console.log(item.id+1);
        resolve(item.id+1)
    });

  });
}
getNextId(AnswersPhotos)
.then((data) => {
  console.log('data', data);
})
.catch((error) => {
  console.log('error', error);
})


const questionInsert = (questionData, callback) => {
  let id;
  let question={};
  getNextId(Question)
  .then((nextId) => {

      id = nextId;
      question.question_id =  id;
      question.question_body = questionData.body;
      question.question_helpfulness = 0;
      question.question_date = new getDate();
      question.asker_name = questionData.name;
      question.asker_email = questionData.email;
      question.product_id = questionData.product_id;
      question.reported = false;
      let newQ = new Question(question);
      newQ.save((err) => {
        if(err){
         return err;

        } else {
          callback(null, "successfully saved")
        }
      })
  })
  .catch((error) => {
    console.log('error', error);
    callback(error);
  })
}
const answerInsert = (answerData, question_id, callback) => {
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
                callback(null, "Answer and photos successfully saved");
              }
            })
          }else {
            callback(null, "Answer successfully saved");
          }


        }
      })
  })
  .catch((error) => {
    console.log('error', error);
    callback(error);
  })
}
const answerPhotoInsert = (photoData, callback) => {
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
}
const answerPhotoAggregateInsert = function(answerData, question_id, callback) {
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
      answer.photos = [];
      for(var i=1; i<=answerData.photos.length; i++) {
          var photoObj = {};
          photoObj.id = i;
          photoObj.url = answerData.photos[i].url;
          photoObj.answer_id = answer.id;
          answer.photos.push(photoObj);
      }
      let newAnswer =new AnswerPhotosAggregate(answer);
      newAnswer.save((err) => {
        if(err){

         callback(err);
        } else {

          callback(null, "Answer Data with photos successfully saved");
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