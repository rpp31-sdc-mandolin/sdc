const { MongoClient } = require('mongodb');

let product;

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
    const result = await aggGetProduct(target);
    callback(null, result)
  } catch (err) {
    callback(err, null)
  }
}


async function getProductStyle(target, callback) {
  target = Number(target)

  try {
    const result = await aggGetProductStyle(target);
    callback(null, finalResult(result))
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
  const filterFeatures = (array) => {
    for ( let i = 0; i < array.length; i++ ) {
      if (array[i].value === 'null') {
        array[i].value = null
      }
    }
    return array
  }
  for await (const doc of cursor) {
    return ({
    'id': doc.id,
    'name': doc.name,
    'slogan': doc.slogan,
    'description': doc.description,
    'category': doc.category,
    'default_price': doc.default_price.toString(),
    'features': filterFeatures(doc.features)
    })
  }
}

async function aggGetProductStyle (target) {

  const cursor = await product.find({id: target})
  // var stats = await cursor.explain('executionStats')

  for await (const doc of cursor) {
    return doc
  }
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
  getAllProducts: getAllProducts,
  getProduct: getProduct,
  getProductStyle: getProductStyle
}