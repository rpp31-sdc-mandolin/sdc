const { MongoClient } = require('mongodb');

async function getAllProducts() {
  const client = new MongoClient('mongodb://127.0.0.1:27017/sdc_test')

  try {
    await client.connect(() => {
      console.log('CONNECTED')
    })
    const result = await aggAllProducts(client);
    callback(null, result);
  } catch (e) {
    console.log('ERROR', e)
    callback(e, null);
  } finally {
    await client.close(() => {
      console.log('ENDING')
    });
  }

}

async function getProduct(target, callback) {
  target = Number(target)
  const client = new MongoClient('mongodb://127.0.0.1:27017/sdc_test')

  try {
    await client.connect(() => {
      console.log('CONNECTED')
    })

    const result = await aggGetProduct(client, target);
    callback(null, result)

  } catch (e) {
    console.log('ERROR', e)
    callback(e, null);
  } finally {

    await client.close(() => {
      console.log('ENDING')
    });
  }
}


async function getProductStyle() {
  const client = new MongoClient('mongodb://127.0.0.1:27017/sdc_test')

  try {
    await client.connect(() => {
      console.log('CONNECTED')
    })

    await aggGetProductStyle(client);

  } catch (e) {
    console.log('ERROR', e)
  } finally {

    await client.close(() => {
      console.log('ENDING')
    });
  }
}


async function aggAllProducts (client, id) {
  const cursor = client.db("sdc_test").collection("document_test").find({}).sort({id: 1}).limit(5)

  const result = await cursor.toArray()

  console.log (result);
  return result;
}

async function aggGetProduct (client, target) {
  console.log('TARGET', typeof target, target)
  const cursor = client.db("sdc_test").collection("document_test").find({id: target})

  const result = await cursor.toArray()
  // console.log (typeof result[0], result[0])
  return result[0]
}

// async function createDatabase(client, number) {

//   const pipeline = [
//     { '$match': {
//       'id': number
//     } },
//     {'$lookup': {
//       'from': 'features',
//       'localField': 'id',
//       'foreignField': 'product_id',
//       'as': 'features'
//     }},
//     {'$lookup': {
//       'from': 'styles',
//       'localField': 'id',
//       'foreignField': 'productId',
//       'as': 'styles'
//     }},
//     {'$addFields': {
//       'style_id': '$styles.id',
//       'product_id': '$id'
//       }
//     },
//     {'$lookup': {
//       'from': 'skus',
//       'localField': 'style_id',
//       'foreignField': 'styleId',
//       'as': 'skus'
//     }},
//     {'$lookup': {
//       'from': 'photos',
//       'localField': 'style_id',
//       'foreignField': 'styleId',
//       'as': 'photos'
//     }}
//   ]

//   const test = client.db("sdc_test").collection("document_test").find({}).limit(5)

//   // var stats = await test.explain('executionStats')
//   // console.log(stats)
//   await test.forEach(test => {
//     console.log(`${test.id}`)
//     client.db("sdc_test").collection("document_test").insertOne(test);
//   })

// }





// Inherited Code
// const axios = require('axios');
// const config = require('../../config.js');

// const server = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/products/'

// const getAllProducts = (callback) => {
//   let options = {
//     url: server,
//     method: 'get',
//     headers: {
//       'User-Agent': 'request',
//       'Authorization': config.API_KEY || process.env.API_KEY
//     },
//     params: {
//       page: 1,
//       count: 5
//     }
//   }

//   axios(options)
//     .then((response) => {
//       callback(null, response.data);
//     })
//     .catch((err) => {
//       callback(err);
//     })
// };

// const getProduct = (productID, callback) => {
//   let options = {
//     url: server + productID,
//     method: 'get',
//     headers: {
//       'User-Agent': 'request',
//       'Authorization': config.API_KEY || process.env.API_KEY
//     },
//   }

//   axios(options)
//     .then((response) => {
//       callback(null, response.data);
//     })
//     .catch((err) => {
//       callback(err);
//     })
// };

// const getProductStyle = (productID, callback) => {
//   let options = {
//     url: server + productID + '/styles',
//     method: 'get',
//     headers: {
//       'User-Agent': 'request',
//       'Authorization': config.API_KEY || process.env.API_KEY
//     }
//   };

//   axios(options)
//     .then((response) => {
//       callback(null, response.data);
//     })
//     .catch((err) => {
//       console.log('RESPONSE ERR:', err)
//       callback(err);
//     })
// };

module.exports = {
  getAllProudcts: getAllProducts,
  getProduct: getProduct
}