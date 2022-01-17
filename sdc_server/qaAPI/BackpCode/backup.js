

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


/* answersAndPhotos.forEach((answer) => {
        var answerObj = {};
          answerObj.answer_id = answer.id;
          answerObj.body = answer.body;
          answerObj.answerer_name = answer.answerer_name;
          answerObj.helpfulness = answer.helpfulness;
          answerObj.date = answer.date;
          answerObj.photos = [];
          answer.photos.forEach((photo) => {
            var photoObj = {};
            photoObj.id = photo.id;
            photoObj.url = photo.url;
            answerObj.photos.push(photoObj);
          });


          resultObj.results.push( answerObj);
          //answer.answer_id = answer.id;
          //resultObj.results.push(answer);
       });*/
       //console.log("now giving back without modification")


       /*app.get('/qa/questions/', (req,res)=>{

  var product_id = req.query.product_id;
  //console.log("at endpoint", product_id);
  questionsForProduct(product_id)
  .then((data) => {

    res.statusCode = 200;
    res.send((data));
  })
  .catch((error) => {
    res.statusCode = 404;
    res.send(error);
  })

});*/