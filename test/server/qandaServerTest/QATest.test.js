

//import fetch from '../../../sdc_server/qaAPI/Controllers/fetch.js';
//import app from '../../../sdc_server/qaAPI/API/qandaAPI.js';
//import request from 'supertest';
const app = require('../../../sdc_server/qaAPI/API/qandaAPI.js');
const request = require('supertest');
const regeneratorRuntime = require("regenerator-runtime");
const {Question}  = require("../../../sdc_server/qaAPI/Model/db.js");

describe("GET /qa/questions/", () => {
  it("should respond with a status code 200", async () => {
    const response = await request(app).get('/qa/questions/').query({product_id:34});
    expect(response.statusCode).toBe(200);
    expect(typeof response.body).toBe('object');
    expect(Array.isArray(response.body.results)).toBe(true);
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
  //let question_id;
  /*beforeEach(() => {
    Question.find({asker_email:'Armando.Kunde@gmail.com'}, (err,data) => {
      if(!err) {
        question_id = data.question_id;
      }
  })*/
  it("should respond with a status code 201", async () => {

        const response = await request(app).post('/qa/questions/118/answers').send({
          body:'This is good.',
          email:'Simol.Nair@gmail.com',
          name:'Simol',
          question_id:118

        });
        expect(response.statusCode).toBe(201);
        expect(typeof response.body).toBe('object');

    })



  })

