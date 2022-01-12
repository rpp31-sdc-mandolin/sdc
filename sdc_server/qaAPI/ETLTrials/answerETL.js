

const csv = require('csv-parser')
const fs = require('fs')
const mongoose = require('mongoose');
const {Answer}= require("../db.js");
var parser = csv({columns: true}, function (err, records) {
	console.log(records);
});


// localhost connection
mongoose.connect('mongodb://localhost:27017/qanda9',{
    useNewUrlParser:true
})

var validateEmail = function (elementValue){
   var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
   return emailPattern.test(elementValue);
 }

var count=0;
let answer;
let date;
let reported;
fs.createReadStream('/Users/sangeetha/Documents/HackReactor/answers.csv')
  .pipe(parser)
  .on('data', (csvRow) => {


    //console.log('csvRow:',csvRow);

    //count++;

    if(csvRow['id']!== null && csvRow['question_id']!==null && csvRow['body'] !== null &&
      csvRow['date_written']!== null && csvRow['answerer_name'] !== null &&
      csvRow['answerer_email']!== null) {
         // if(validateEmail(csvRow['answerer_email'])){
            date = new Date(Number(csvRow['date_written']));
            csvRow['date_written'] = date;
            reported = (csvRow['reported'] == '0')? false: true;
            csvRow['reported'] = reported;
            //console.log("csvRow:", csvRow);
            answer = new Answer(csvRow);

            answer.save(function(err, item) {
              if (item) {
                  count++;
                  //console.log("item", item);
              }
              if (err) {
                console.log("Error", err);
              }
            });
          //}

      }


    /**/
    })
  .on('end', () => {
    console.log("Done");
    console.log("Count:", count);
  });