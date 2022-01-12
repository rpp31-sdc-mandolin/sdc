const {Question} = require('../Model/db.js');
const {AnswerPhotosAggregate} = require('../Model/db.js');

const updateQuestionReport = function(questionId, callback) {
  Question.findOneAndUpdate({question_id:questionId}, {reported:true}, (err, data) => {
    if(err) {
      callback(err);
    }else {
      callback(null, data);
    }
  })
}
const updateAnswerReport = function(answer_id) {
  return new Promise((resolve,reject) => {
    var filter = {id: answer_id};
    var update = {reported: true};
    console.log("inside this with answer_id:", answer_id);
    AnswerPhotosAggregate.findOneAndUpdate(filter, update, (err, data) => {
    if(err) {
      reject(err)
    } else {
      resolve(data);
    }
  })
  });

}
const updateQuestionHelpful = function(questionId, callback) {
  var filter = {question_id: questionId};
  console.log("reached updateQuestionHelpful");
  Question.findOneAndUpdate(filter, {$inc:{'question_helpfulness': 1}},(error, data) => {
    if(error) {
      callback(error);
    } else {
      callback(null, data);
    }
  })
}
const updateAnswerHelpful = function(answer_id) {
  return new Promise((resolve,reject) => {
    var filter = {id: answer_id};
     AnswerPhotosAggregate.findOneAndUpdate(filter,{$inc:{'helpfulness': 1}}, (err, data) => {
    if(err) {
      reject(err)
    } else {
     resolve(data);
    }
  })
  })

}

/*updateAnswerReport(228, (err,data) => {
  if(err){
    console.log(err)
  }else {
    console.log(data)
  }
})*/
module.exports = {
  updateQuestionReport:updateQuestionReport,
  updateAnswerReport:updateAnswerReport,
  updateQuestionHelpful:updateQuestionHelpful,
  updateAnswerHelpful:updateAnswerHelpful
}