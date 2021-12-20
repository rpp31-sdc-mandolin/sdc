const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
// const csv = require('csv-parser');
// const fs = require('fs');
// mongoose.connect('mongodb://127.0.0.1:27017/sdc_test', function(err, db) {
//   if (err) {
//     console.log('error')
//   } else {
//     console.log('CONNECTED')
//   }
// });

async function main() {
  const client = new MongoClient('mongodb://127.0.0.1:27017/sdc_test')

  try {
    await client.connect();
    // await createDatabase(client, 2)
    // await listDatabases(client);
    for (var i = 7962; i < 1000011; i++) {
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

async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases();
  console.log(databasesList);
}

async function getProducts(client) {

  // const pipeline = [
  //   {
  //     '$match': {
  //       'id': 1
  //     }
  //   }
  //   // , {
  //   //   '$group': {
  //   //     '_id': '$id'
  //   //   }
  //   // }
  // ];

  const aggCursor = client.db("sdc_test").collection("products").explain("executionStats").aggregate(pipeline);

  await aggCursor.forEach(test => {
    console.log(`${test._id}: ${test._id}`)
  })
}

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
    }},
  ]

  const test = client.db("sdc_test").collection("products_test").aggregate(pipeline)

  await test.forEach(test => {
    console.log(`${test.id}`)
    client.db("sdc_test").collection("featureAgg").insertOne(test);
  })
}








// let productSchema = mongoose.Schema({
//   id: {
//     type: Number,
//     unique: true
//   },
//   name: String,
//   slogan: String,
//   description: String,
//   category: String,
// })

// let Product = mongoose.model('Product', productSchema);

// let load = () => {
//   return Product.find()
// }