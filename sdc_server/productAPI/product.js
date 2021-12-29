const { MongoClient } = require('mongodb');
// const client = new MongoClient('mongodb://127.0.0.1:27017/sdc_test')
// client.connect()

async function getAllProducts(callback) {
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


async function getProductStyle(target, callback) {
  target = Number(target)
  const client = new MongoClient('mongodb://127.0.0.1:27017/sdc_test')

  try {
    await client.connect(() => {
      console.log('CONNECTED')
    })
    const result = await aggGetProductStyle(client, target);
    console.log('RESULT in style', result)
    callback(null, finalResult(result))
  } catch (e) {
    console.log('ERROR', e)
    callback(e, null)
  } finally {
    await client.close(() => {
      console.log('ENDING')
    });
  }
}


async function aggAllProducts (client, id) {
  const cursor = client.db("sdc_test").collection("document_test").find({}).sort({id: 1}).limit(5)
  const result = await cursor.toArray()

  return result;
}

async function aggGetProduct (client, target) {
  const cursor = client.db("sdc_test").collection("document_test").find({id: target})
  const result = await cursor.toArray()

  return result[0]
}

async function aggGetProductStyle (client, target) {

  const cursor = client.db("sdc_test").collection("document_test").find({id: target})
  const search = await cursor.toArray()
  const product = search[0]

  return product

}

const filterSkus = (array, target) => {
  var filterSkusResult = {};
  for (let i = 0; i < array.length; i++) {
    if (array[i].styleId === target) {
      filterSkusResult[array[i].id] = {size: array[i].size, quantity: array[i].quantity}
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

  console.log('styles result:', result)

  return ({
    'product_id': product.id.toString(),
    'results': result
  })
}


module.exports = {
  getAllProudcts: getAllProducts,
  getProduct: getProduct,
  getProductStyle: getProductStyle
}