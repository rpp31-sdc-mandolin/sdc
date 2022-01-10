const path = require('path');
const compression = require('compression');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
  throw result.error
}
//to save outfitIds as cookies
const cookieParser = require('cookie-parser');
const middleware = require('./middle.js');

const main = require('./../sdc_server/reviewAPI/index.js')
const reviews = require('./../sdc_server/reviewAPI/api/reviews.route.js');
main(app).catch(console.err)


const axios = require('axios').default;
const controllers = require('./controllers.js');

app.use(cookieParser());
app.use(compression());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

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

app.use('/reviews', reviews)

app.get('/cart', controllers.cart.getProductsInCart);
app.post('/cart', controllers.cart.postProductToCart);

app.post('/interactions', controllers.interactions.postInteraction);
