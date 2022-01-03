const { MongoClient } = require('mongodb');
const Reviews = require('./model/reviews.model.js');
const Metadata = require('./model/metadata.model.js');
const app = require('../../server/index.js')

const uri = 'mongodb://localhost:27017';
MongoClient
  .connect(uri, { maxPoolSize: 10 })
  .catch(e => console.error(err.stack))
  .then(async cleint => {
    console.log('Connected successfully to server');
    const db = client.db('reviewService');

    // Make my database ready
    await Reviews.injectCollection(db);
    await Metadata.injectCollection(db);

    // runs server after my db connection is established
    let port = 3000;
    app.listen(port, () => {
      console.log(`Server is listening on port: ${port}`);
    });
  });






