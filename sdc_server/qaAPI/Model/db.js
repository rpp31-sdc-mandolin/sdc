

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
mongoose.connect('mongodb://localhost:27017/qanda9');

//console.log(process.memoryUsage());
const used = process.memoryUsage();
for (let key in used) {
  console.log(`Memory: ${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
}
//for quicker response
//mongoose.createConnection(uri, { maxPoolSize: 10 });
mongoose.connection.on('connecting', () => {
  console.log('connecting')
  console.log(mongoose.connection.readyState); //logs 2
});
mongoose.connection.on('connected', () => {
  console.log('connected');
  console.log(mongoose.connection.readyState); //logs 1
});
let questionSchema = new mongoose.Schema({
  question_id: {
    type:Number,
    required:true,
    index:true
  },
  product_id: {
    type:Number,
    required:true,
    index:true
  },
  question_body:String,
  question_date:Date,
  asker_name:String,
  asker_email:String,
  reported:Boolean,
  helpfulness:Number

},
{collection: 'Question'}
);
let Question = mongoose.model('Question', questionSchema);

let answerSchema = new mongoose.Schema({
  id:{
    type:Number,
    required:true,
    index:true
  },
  question_id: {
    type:Number,
    ref:Question,
    required:true
  },
  body:String,
  date:Date,
  answerer_name:String,
  answerer_email:String,
  reported:Boolean,
  helpfulness:Number


},
{ collection : 'Answer' }
);
let Answer = mongoose.model('Answer', answerSchema);
let answersPhotosSchema = new mongoose.Schema({
  id:{
    type:Number,
    required:true,
    index:true
  },
  answer_id:{
    type:Number,
    ref:Answer,
    required:true
  },
  url:String
},
{collection: 'AnswersPhotos'})

let AnswersPhotos = mongoose.model('AnswersPhotos',  answersPhotosSchema);

let photosSchema = new mongoose.Schema({
  id:{
    type:Number,
    required:true,
    index:true
  },
  answer_id:{
    type:Number,
    ref:Answer,
    required:true
  },
  url:String
})
let answerPhotosAggregateSchema = new mongoose.Schema({
  id:{
    type:Number,
    required:true,
    index:true
  },
  question_id: {
    type:Number,
    ref:Question,
    required:true,
    index:true
  },
  body:String,
  date:Date,
  answerer_name:String,
  answerer_email:String,
  reported:Boolean,
  helpfulness:Number,
  photos:[photosSchema]
},
{collection: 'AnswerPhotosAggregate'})

let AnswerPhotosAggregate = mongoose.model('AnswerPhotosAggregate',  answerPhotosAggregateSchema);




/*Answer.find({id:7}, (err,data) => {
  console.log("data from answer", data);
})*/
/*Answer.count({} , (err,data) => {
  console.log("data from count", data);
})*/

module.exports = {
  Question: Question,
  Answer: Answer,
  AnswersPhotos:AnswersPhotos,
  AnswerPhotosAggregate:AnswerPhotosAggregate
}