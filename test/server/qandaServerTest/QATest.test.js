

//import fetch from '../../../sdc_server/qaAPI/Controllers/fetch.js';
//import app from '../../../sdc_server/qaAPI/API/qandaAPI.js';
//import request from 'supertest';
const app = require('../../../sdc_server/qaAPI/API/qandaAPI.js');
const request = require('supertest');
const regeneratorRuntime = require("regenerator-runtime");


const {Question}  = require("../../../sdc_server/qaAPI/Model/db.js");
const {Answer}  = require("../../../sdc_server/qaAPI/Model/db.js");
const {AnswerPhotosAggregate}  = require("../../../sdc_server/qaAPI/Model/db.js");

describe("GET /qa/questions/", () => {
  it("should respond with a status code 200", async () => {
    const response = await request(app).get('/qa/questions/').query({product_id:34});
    expect(response.statusCode).toBe(200);
    expect(typeof response.body).toBe('object');
    expect(Array.isArray(response.body.results)).toBe(true);
  })

})
describe("GET /qa/questions/", () => {
  it("if the product_id is not present, should respond with an empty object", async () => {
    const response = await request(app).get('/qa/questions/').query({product_id:0});
    expect(response.statusCode).toBe(200);
    expect(typeof response.body).toBe('object');
    expect(response.body.results.length).toBe(0);
    //expect(Object.keys(response.body).length).toBe();
  })

})
describe("GET /qa/questions/", () => {
  it("should repond with 404, if the product_id is not given", async () => {
    const response = await request(app).get('/qa/questions/').query();
    expect(response.statusCode).toBe(404);
    //expect(typeof response.body).toBe('object');
    //expect(response.body.results.length).toBe(0);
    //expect(Object.keys(response.body).length).toBe();
  })

})
describe("GET /qa/questions/:question_id/answers", () => {
  it("should respond with a status code 200", async () => {
    const response = await request(app).get('/qa/questions/116/answers').send();
    expect(response.statusCode).toBe(200);
    expect(typeof response.body).toBe('object');
    expect(Array.isArray(response.body.results)).toBe(true);
  })

})

describe("POST /qa/questions", () => {
  it("should respond with a status code 201", async () => {
    const response = await request(app).post('/qa/questions').send({
      body:'How is this product?',
      email:'Sangee.Nair@gmail.com',
      name:'Sangee',
      product_id:34
    });
    expect(response.statusCode).toBe(201);
    expect(typeof response.body).toBe('object');

  })

})

describe("POST /qa/questions/:question_id/answers", () => {

  it("should respond with a status code 201", async () => {

        const response = await request(app).post('/qa/questions/118/answers').send({
          body:'This is good.',
          email:'Simol.Nair@gmail.com',
          name:'Simol',
          question_id:118,
          photos:[ "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80"]

        });
        expect(response.statusCode).toBe(201);
        expect(typeof response.body).toBe('object');

    })



})
describe("POST /qa/questions/:question_id/answers", () => {

  it("should respond with a status code 500", async () => {

        const response = await request(app).post('/qa/questions/0/answers').send({
          body:'This is good.',
          email:'Simol.Nair@gmail.com',
          name:'Simol',
          question_id:118

        });
        expect(response.statusCode).toBe(500);
        expect(typeof response.body).toBe('object');

    })



})
/*describe("POST /qa/questions", () => {

  it("should respond with a status code 500", async () => {

        const response = await request(app).post('/qa/questions/').send({
          body:'How is this product?',


        });
        expect(response.statusCode).toBe(500);
        expect(typeof response.body).toBe('object');

    })



})*/
describe("PUT /qa/answers/:answer_id/helpful", () =>{
  it("should respond with a status code 204", async() => {
    const response = await request(app).put('/qa/answers/6879307/helpful').send();
    expect(response.statusCode).toBe(204);
    expect(typeof response.body).toBe('object');
  });

})
describe("PUT /qa/answers/:answer_id/report", () =>{
  it("should respond with a status code 204", async() => {
    const response = await request(app).put('/qa/answers/6879307/report').send();
    expect(response.statusCode).toBe(204);
    expect(typeof response.body).toBe('object');
  });

})
describe("PUT /qa/questions/:question_id/helpful", () =>{
  it("should respond with a status code 204", async() => {
    const response = await request(app).put('/qa/questions/3518964/helpful').send();
    expect(response.statusCode).toBe(204);
    expect(typeof response.body).toBe('object');
  });

})
describe("PUT /qa/questions/:question_id/report", () =>{
  it("should respond with a status code 204", async() => {
    const response = await request(app).put('/qa/questions/3518964/report').send();
    expect(response.statusCode).toBe(204);
    expect(typeof response.body).toBe('object');
  });

})
describe("PUT /qa/questions/:question_id/report", () =>{
  it("if the question_id is not present, should respond with an empty object", async() => {
    const response = await request(app).put('/qa/questions/3518965/report').send();
    //expect(response.statusCode).toBe(404);
    expect(typeof response.body).toBe('object');
    expect(Object.keys(response.body).length).toBe(0);
  });

})
describe("PUT /qa/answers/:answer_id/report", () =>{
  it("if the answer_id is not present, should respond with an empty object", async() => {
    const response = await request(app).put('/qa/answers/6879308/report').send();
    //expect(response.statusCode).toBe(404);
    expect(typeof response.body).toBe('object');
    expect(Object.keys(response.body).length).toBe(0);
  });

})
afterAll(() => {
  Question.deleteOne({product_id:34, question_id:3518964})
  .then((data) => { console.log("row deleted:",data)})
  .catch((error) => {console.log(error)});
  AnswerPhotosAggregate.deleteOne({id:6879307, question_id:118})
  .then((data) => { console.log("row deleted:",data)})
  .catch((error) => {console.log(error)});
});


