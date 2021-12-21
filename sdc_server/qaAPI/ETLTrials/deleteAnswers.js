


const mongoose = require('mongoose');
const {Answer}= require("../db.js");

mongoose.connect('mongodb://localhost:27017/qanda9',{
    useNewUrlParser:true
})

Answer.deleteMany({}, function(err,data) {
  if(err){
    console.log(err)
  }else {
    console.log('data',data);
  }

});