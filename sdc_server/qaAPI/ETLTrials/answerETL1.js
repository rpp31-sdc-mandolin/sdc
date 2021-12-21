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
fs.createReadStream('/Users/sangeetha/Documents/HackReactor/answers.csv')
  .pipe(parser)
  .on('data', (csvRow) => {
    //let zipArr = data['zips'].split(" ");
    /*var newCity = new City({
      cityName: data['city'],
      state:data['state_name'],
      cityDisplayName:data['display_name'],
      zips:zipArr,
    });*/
    //console.log('csvRow:',csvRow);

    //count++;

            var answer = new Answer(csvRow);

            answer.save(function(err, item) {
              if (item) {
                 // count++;
                  //console.log("item", item);
              }
              if (err) {
                console.log("Error", err);
              }
            });
          //}

      })


    /**/

  .on('end', () => {
    console.log("Done");
    //console.log("Count:", count);
  });