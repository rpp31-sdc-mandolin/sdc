const {Question} = require('../Model/db.js');
const {AnswerPhotosAggregate} = require('../Model/db.js');
const {createClient} = require('redis');
//const redisUrl="redis://172.31.30.101:6379";

const updateQuestionReport = function(questionId, callback) {
  Question.findOneAndUpdate({question_id:questionId}, {reported:true}, (err, data) => {
    if(err) {
      callback(err);
    }else {
      Question.find(filter, (err, questionData) => {
        if(questionData) {

          (async () => {
            //const client = createClient({url:redisUrl});
            const client = createClient();
            client.on('error',(err) => console.log('Redis Client err',err));
            await client.connect();
            var delKey = questionData[0].product_id

            await client.del(delKey + "");

          })();
        }
      });
      callback(null, data);
    }
  })
}
const updateAnswerReport = function(answer_id) {
  return new Promise((resolve,reject) => {
    console.log("inside AnswerReport", answer_id);
    var filter = {id: answer_id};
    var update = {reported: true};
    console.log("inside this with answer_id:", answer_id);
    AnswerPhotosAggregate.findOneAndUpdate(filter, update, (err, data) => {
    if(err) {
      reject(err)
    } else {

      AnswerPhotosAggregate.find(filter, (err,answerData) => {
        if(answerData) {
          console.log(answerData);
          console.log("inside AnswerReport");
        (async () => {
          console.log("inside redis function");
          //const client = createClient({url:redisUrl});
          const client = createClient();
          client.on('error',(err) => console.log('Redis Client err',err));
          await client.connect();
          var delKey = answerData[0].question_id+" "+"answers";
          await client.del(delKey);
          delKey =  answerData[0].question_id+" "+"questions";
           await client.del(delKey + "");


        })();
        }

      })
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

      Question.find(filter, (err, questionData) => {
        if(questionData) {

          (async () => {
            //const client = createClient({url:redisUrl});
            const client = createClient();
            client.on('error',(err) => console.log('Redis Client err',err));
            await client.connect();
            var delKey = questionData[0].product_id

            await client.del(delKey + "");

          })();
        }
      })

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
      AnswerPhotosAggregate.find({id:answer_id}, (err,answerData) => {
        (async () => {
          //const client = createClient({url:redisUrl});
          const client = createClient();
          client.on('error',(err) => console.log('Redis Client err',err));
          await client.connect();
          var delKey = answerData[0].question_id+" "+"answers";
          await client.del(delKey);
          delKey =  answerData[0].question_id+" "+"questions";
           await client.del(delKey + "");

        })();
      })
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