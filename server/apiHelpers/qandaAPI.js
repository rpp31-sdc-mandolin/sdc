const axios = require('axios');
const config = require('../../config.js');

//const server = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/qa/questions'

var counter = 0;
const hosts = ["http://localhost:4000"];
//const hosts = ["http://3.92.184.78:4000", "http://54.172.36.188:4000"];

var selectHost = function() {
  let index = ++counter;//Date.now(); //Math.floor(Math.random() * 10);
  let hostIndex = index % hosts.length;
  console.log('Selected index ' + index + ", " + hostIndex +  ", server " + hosts[hostIndex]);
  return hosts[hostIndex];
};


const qaUrlPrefix = '/qa/questions';
const getQuestions = (productID, callback) => {
  console.log("inside get questions");
  console.log(selectHost() + qaUrlPrefix);
  let options = {
    url: selectHost() + qaUrlPrefix,
    method: 'get',
    headers: {
      'User-Agent': 'request',
      'Authorization': config.API_KEY || process.env.API_KEY
    },
    params: {
     product_id: productID,
      //product_id:34,
      page: 1,
      count: 100
    }
  };

  axios(options)
    .then((response) => {

      callback(null, response.data);
    })
    .catch((err) => {
      callback(err);
      console.log(err);
    })
};

const getAnswersByID = (questionID, callback) => {
  console.log("get Answers");
  let options = {
    url: selectHost() + qaUrlPrefix + questionID + '/answers',
    method: 'get',
    headers: {
      'User-Agent': 'request',
      'Authorization': config.API_KEY || process.env.API_KEY
    },
    params: {
      page: 1,
      count: 5
    }
  };

  axios(options)
    .then((response) => {
      //console.log(response.data);
      callback(null, response.data);
    })
    .catch((err) => {
      callback(err);
    })
}

const postQuestions = (questionData, callback) => {

  //questionData.product_id= 34;

  let options = {
    url: selectHost() + qaUrlPrefix,
    method: 'post',
    headers: {
      'User-Agent': 'request',
      'Authorization': config.API_KEY || process.env.API_KEY
    },
    data: questionData
  };

  axios(options)
    .then((response) => {
      //console.log(response);
      callback(null, response.data);
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    })
};


const putQuestions = (questionID, callback) => {
  console.log("Clicked yes");
  let options = {
    url: selectHost() + qaUrlPrefix + '/' + questionID + '/helpful',
    method: 'put',
    headers: {
      'User-Agent': 'request',
      'Authorization': config.API_KEY || process.env.API_KEY
    }
  };

  axios(options)
    .then((response) => {
      callback(null, response.data)
    })
    .catch((err) => {
      console.log(err);
    })
}

const putAnswers = (answerID, callback) => {
  let options = {
   // url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/qa/answers/${answerID}/helpful`,
    url: selectHost() + `/qa/answers/${answerID}/helpful`,
    method: 'put',
    headers: {
      'User-Agent': 'request',
      'Authorization': config.API_KEY || process.env.API_KEY
    }
  }

  axios(options)
  .then((response) => {
    callback(null, response.data)
  })
  .catch((err) => {
    console.log(err);
  })
}

const reportAnswers = (answerID, callback) => {
  let options = {
   // url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/qa/answers/${answerID}/report`,
    url: selectHost() + `/qa/answers/${answerID}/report`,
    method: 'put',
    headers: {
      'User-Agent': 'request',
      'Authorization': config.API_KEY || process.env.API_KEY
    }
  }

  axios(options)
  .then((response) => {
    callback(null, response.data)
  })
  .catch((err) => {
    console.log(err);
  })
}

const addAnswer = (answer, questionID, callback) => {
  let options = {
    url: selectHost() + qaUrlPrefix + '/' + questionID + '/answers',
    method: 'post',
    headers: {
      'User-Agent': 'request',
      'Authorization': config.API_KEY || process.env.API_KEY
    },
    data: answer
  };

  axios(options)
    .then((response) => {
      callback(null, response.data)
    })
    .catch((err) => {
      console.log(err);
    })
}

module.exports = {
  getQuestions,
  getAnswersByID,
  postQuestions,
  putQuestions,
  putAnswers,
  addAnswer,
  reportAnswers
};