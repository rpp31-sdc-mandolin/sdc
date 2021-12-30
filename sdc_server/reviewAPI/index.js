const { MongoClient } = require('mongodb');

const db = async () => {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri, { maxPoolSize: 10, useNewUrlParser: true });

  try {
    await client.connect();
    console.log('Connected successfully to server');

    const db = client.db('reviewService');

    // my database interacting api goes here....
      // i need to import from model.js


  } catch(error) {
    console.log(error);
  } finally {
    await client.close();
  }
};

module.exports = db;


