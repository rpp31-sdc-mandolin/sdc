const { MongoClient } = require('mongodb');
const Reviews = require('./model/reviews.model.js');
const Metadata = require('./model/metadata.model.js');
const app = require('../../server/index.js')

const main = async () => {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri, { maxPoolSize: 10 });

  try {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db('reviewService');

    await Reviews.injectCollection(db);
    await Metadata.injectCollection(db);

    let port = 3000;
    app.listen(port, () => {
      console.log(`Server is listening on port: ${port}`);
    });
  } catch(error) {
    console.log(error);
  } finally {
    await client.close();
  }
};

main()
  .catch(console.log)



