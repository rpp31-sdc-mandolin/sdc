// const newrelic = require('newrelic');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const db = require('../sdc_server/productAPI/product.js')
const initializeDatabases = require('../sdc_server/productAPI/dbIndex.js');
const routes = require('./sdc_routes.js');
const result = dotenv.config();
if (result.error) {
  throw result.error
}

// console.log(result.parsed);
const port = 3000;
const path = require('path');
const compression = require('compression');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const axios = require('axios').default;
const controllers = require('./controllers.js');

//to save outfitIds as cookies
const cookieParser = require('cookie-parser');
const middleware = require('./middle.js');
app.use(cookieParser());

app.use(compression());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// initializeDatabases()
//   .then( dbs => {
//     routes(app, dbs).listen(3000, () => console.log('Listening on port 3000'))
// }). catch ( err => {
//   console.log(err)
// })

app.get('/loaderio-7697d68ba0628325cd70a1a385052cf5', function (req, res) {
  res.send('loaderio-7697d68ba0628325cd70a1a385052cf5')
})

app.get('/products', controllers.products.getAllProducts);
app.get('/products/:product_id', controllers.products.getProductByID);
app.get('/products/:product_id/styles', controllers.products.getProductStyleByID);
app.get('/products/:product_id/related', controllers.products.getRelatedProductsByID);

// routes added for Related_Outfit component
app.get('/products/related/details', controllers.products.getDetailsForProducts);
app.get('/products/outfit/details', middleware.setCookies, controllers.products.getDetailsForProducts);
//route to get the cookies
//app.use(middleware.setCookies);
app.get('/cookies', controllers.cookies.getCookies);


app.get('/qa/questions/', controllers.questions_answers.getAllQuestions);
app.post('/qa/questions/', controllers.questions_answers.postQuestion);
app.put('/qa/questions/:question_id/helpful', controllers.questions_answers.updateQuestionHelpfulness);

app.put('/qa/answers/:answer_id/helpful', controllers.questions_answers.updateAnswerHelpfulness);
app.put('/qa/answers/:answer_id/report', controllers.questions_answers.reportAnswer);
app.post('/qa/questions/:question_id/answers', controllers.questions_answers.postAnswer);

app.get('/reviews', controllers.reviews.getAllReviews);
app.post('/reviews', controllers.reviews.postReviews);
app.get('/reviews/meta', controllers.reviews.getReviewsMeta);
app.put('/reviews/helpful', controllers.reviews.markHelpful);
app.put('/reviews/:review_id/report', controllers.reviews.reportReview);

app.get('/cart', controllers.cart.getProductsInCart);
app.post('/cart', controllers.cart.postProductToCart);

app.post('/interactions', controllers.interactions.postInteraction);

MongoClient.connect('mongodb://admin:password@172.31.91.225:27017,172.31.86.133:27017,172.31.90.18:27017/sdc_test?replicaSet=sdcRepl&authSource=admin', {
  // MongoClient.connect('mongodb://172.31.31.124:27017/sdc_test', {
  useUnifiedTopology: true,
})
.catch(err => {
  console.log(err)
})
.then(async client => {
  console.log('client', client)
  await db.connectToDB(client);
  // await db.connectToRedis();
  app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
  });
})
