const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient('mongodb://127.0.0.1:27017/sdc_test')

  try {
    await client.connect();
    // await createDatabase(client, 2)
    // await listDatabases(client);
    for (var i = 1; i < 1000012; i++) {
      await createDatabase(client, i);
    }

  } catch (e) {
    console.log(e);
  } finally {
    console.log('ENDING');
    await client.close();
  }

}

main();

async function createDatabase(client, number) {

  const pipeline = [
    { '$match': {
      'id': number
    } },
    {'$lookup': {
      'from': 'features',
      'localField': 'id',
      'foreignField': 'product_id',
      'as': 'features'
    }},
    {'$lookup': {
      'from': 'styles',
      'localField': 'id',
      'foreignField': 'productId',
      'as': 'styles'
    }},
    {'$addFields': {
      'style_id': '$styles.id',
      'product_id': '$id'
      }
    },
    {'$lookup': {
      'from': 'skus',
      'localField': 'style_id',
      'foreignField': 'styleId',
      'as': 'skus'
    }},
    {'$lookup': {
      'from': 'photos',
      'localField': 'style_id',
      'foreignField': 'styleId',
      'as': 'photos'
    }}
  ]

  const test = client.db("sdc_test").collection("products_test").aggregate(pipeline)

  // var stats = await test.explain('executionStats')
  // console.log(stats)
  await test.forEach(test => {
    console.log(`${test.id}`)
    client.db("sdc_test").collection("document_test").insertOne(test);
  })

}
