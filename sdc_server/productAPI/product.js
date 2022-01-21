const { MongoClient } = require('mongodb');
const { createClient } = require('redis');

let product;
let redisClient;

async function connectToDB(client) {
  if (product) {
    return
  }
  try {
    product = await client.db("sdc_test").collection("document_test")
  } catch (err) {
    console.log(err)
  }
}

async function connectToRedis() {
  if (redisClient) {
    return
  }

  try {
    redisClient = createClient();
    await redisClient.connect();
    redisClient.on('error', (err) => console.log('Redis Client Error', err));
  }
  catch (err) {
    console.log(err)
  }

}

async function getAllProducts(callback) {

  try {
    const result = await aggAllProducts()
    callback(null, result)
  } catch (e) {
    callback(e, null)
  }

}

async function getProduct(target, callback) {
  target = Number(target)

  try {
    redisClient.get(target, async (err, cache) => {
      if (err) {
        throw err;
      }
      if (cache) {
        const result = {
          'id': cache[0].id,
          'name': cache[0].name,
          'slogan': cache[0].slogan,
          'description': cache[0].description,
          'category': cache[0].category,
          'default_price': cache[0].default_price.toString(),
          'features': filterFeatures(cache[0].features)
          }
        callback(null, result);
      } else {
        const result = await aggGetProduct(target);
        redisClient.set(target, result);
        const finalResult = {
          'id': result[0].id,
          'name': result[0].name,
          'slogan': result[0].slogan,
          'description': result[0].description,
          'category': result[0].category,
          'default_price': result[0].default_price.toString(),
          'features': filterFeatures(result[0].features)
        }
        callback(null, finalResult)
      }
    })
  } catch (err) {
    callback(err, null)
  }
}


async function getProductStyle(target, callback) {
  target = Number(target)

  try {
    redisClient.get(target, async (err, cache) => {
      if (err) {
        throw err;
      }
      if (cache) {
        callback(null, finalResult(cache));
      } else {
        const result = await aggGetProductStyle(target);
        redisClient.set(target, result);
        callback(null, finalResult(result))
      }
    })
  } catch (e) {
    callback(e, null)
  }
}

async function aggAllProducts (id) {
  const cursor = await product.find({}).sort({id: 1}).limit(5)
  // var stats = await cursor.explain('executionStats')
  // console.log('getAllProducts stats', stats)
  const dbResult = await cursor.toArray()
  const result = [];

  for (let i = 0; i < dbResult.length; i++) {
    result.push({
      'id': dbResult[i].id,
      'name': dbResult[i].name,
      'slogan': dbResult[i].slogan,
      'description': dbResult[i].description,
      'category': dbResult[i].category,
      'default_price': dbResult[i].default_price.toString(),
    })
  }

  return result;
}

async function aggGetProduct (target) {
  const cursor = await product.find({id: target})
  // var stats = await cursor.explain('executionStats')
  // console.log('getProduct stats', stats)
  const doc = await cursor.toArray()
  return doc
}

const filterFeatures = (array) => {
  for ( let i = 0; i < array.length; i++ ) {
    if (array[i].value === 'null') {
      array[i].value = null
    }
  }
  return array
}

  // return ({
  //   'id': doc[0].id,
  //   'name': doc[0].name,
  //   'slogan': doc[0].slogan,
  //   'description': doc[0].description,
  //   'category': doc[0].category,
  //   'default_price': doc[0].default_price.toString(),
  //   'features': filterFeatures(doc[0].features)
  //   })



async function aggGetProductStyle (target) {

  const cursor = await product.find({id: target})
  // var stats = await cursor.explain('executionStats')

  for await (const doc of cursor) {
    return doc
  }
  // const search = await cursor.toArray()
  // const result = search[0]

  // return result;
}

const filterSkus = (array, target) => {
  var filterSkusResult = {};
  for (let i = 0; i < array.length; i++) {
    if (array[i].styleId === target) {
      filterSkusResult[array[i].id] = {size: array[i].size.toString(), quantity: array[i].quantity}
    }
  }
  return filterSkusResult;
}

const filterSalePrice = (string) => {
  if (string === 'null') {
    return null
  }
  return string
}


const finalResult = (product) => {
  var result = [];
  for (var i = 0; i < product.styles.length; i++) {
    result.push({
      'style_id': product.styles[i].id,
      'name': product.styles[i].name,
      'original_price': product.styles[i].original_price,
      'sale_price': filterSalePrice(product.styles[i].sale_price),
      'default?': product.styles[i].default_style === 1,
      'photos': product.photos,
      'skus': filterSkus(product.skus, product.styles[i].id)
    })
  }

  return ({
    'product_id': product.id.toString(),
    'results': result
  })
}


module.exports = {
  connectToDB: connectToDB,
  connectToRedis: connectToRedis,
  getAllProducts: getAllProducts,
  getProduct: getProduct,
  getProductStyle: getProductStyle
}