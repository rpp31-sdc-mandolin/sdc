const { MongoClient } = require('mongodb');
// const client = new MongoClient('mongodb://127.0.0.1:27017/sdc_test')
// client.connect()

async function getAllProducts(callback) {
  const client = new MongoClient('mongodb://127.0.0.1:27017/sdc_test')
  // connection pool

  try {
    // await client.connect(() => {
    //   console.log('CONNECTED')
    // })
    await client.connect();
    const result = await aggAllProducts(client);
    console.log('All products result', result)
    callback(null, result);
  } catch (e) {
    console.log('ERROR', e)
    callback(e, null);
  } finally {
    // await client.close(() => {
    //   console.log('ENDING')
    // });
    await client.close();
  }

}

async function getProduct(target, callback) {
  target = Number(target)
  const client = new MongoClient('mongodb://127.0.0.1:27017/sdc_test')

  try {
    // await client.connect(() => {
    //   console.log('CONNECTED')
    // })
    await client.connect();
    const result = await aggGetProduct(client, target);
    console.log('product result', result)
    callback(null, result)
  } catch (e) {
    console.log('ERROR', e)
    callback(e, null);
  } finally {
    // await client.close(() => {
    //   console.log('ENDING')
    // });
    await client.close();
  }
}


async function getProductStyle(target, callback) {
  target = Number(target)
  const client = new MongoClient('mongodb://127.0.0.1:27017/sdc_test')

  try {
    // await client.connect(() => {
    //   console.log('CONNECTED')
    // })
    await client.connect();
    const result = await aggGetProductStyle(client, target);
    callback(null, finalResult(result))
  } catch (e) {
    console.log('ERROR', e)
    callback(e, null)
  } finally {
    // await client.close(() => {
    //   console.log('ENDING')
    // });
    await client.close();
  }
}

// getAllProducts()


async function aggAllProducts (client, id) {
  const cursor = client.db("sdc_test").collection("document_test").find({}).sort({id: 1}).limit(5)
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

async function aggGetProduct (client, target) {
  const cursor = client.db("sdc_test").collection("document_test").find({id: target})
  // var stats = await cursor.explain('executionStats')
  // console.log('getProduct stats', stats)
  const result = await cursor.toArray()


  return ({
    'id': result[0].id,
    'name': result[0].name,
    'slogan': result[0].slogan,
    'description': result[0].description,
    'category': result[0].category,
    'default_price': result[0].default_price.toString(),
    'features': result[0].features
  })
}

async function aggGetProductStyle (client, target) {

  const cursor = client.db("sdc_test").collection("document_test").find({id: target})
  // var stats = await cursor.explain('executionStats')
  // console.log('stats', stats)
  const search = await cursor.toArray()
  const product = search[0]

  return product

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
  getAllProducts: getAllProducts,
  getProduct: getProduct,
  getProductStyle: getProductStyle
}