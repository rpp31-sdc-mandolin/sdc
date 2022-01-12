


const {newQuestionsForProduct} = require('./Controllers/fetch.js');
const {fetchAllAnswersAndPhotos} = require('./Controllers/fetch.js');

(async () => {

  console.time('fetchQuestions');
  await newQuestionsForProduct(34);
  console.timeEnd('fetchQuestions');

  console.time('fetchAnswers');
  await fetchAllAnswersAndPhotos(116);
  console.timeEnd('fetchAnswers');
})();