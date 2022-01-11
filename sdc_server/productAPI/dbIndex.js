const MongoClient = require('mongodb').MongoClient

const url = "mongodb://127.0.0.1:27017/sdc_test"

function connect(url) {
  return MongoClient.connect(url).then(client => client.db())
}

module.exports = async function () {
  let database = await connect(url)

  return {
    product: database
  }
}
