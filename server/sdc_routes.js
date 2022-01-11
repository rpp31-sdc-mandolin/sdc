module.exports = function (app, dbs) {

  app.get('/products', (req, res) => {
    dbs.product.collection('document_test').find({}).sort({id: 1}).limit(5).toArray((err, docs) => {
      if (err) {
        res.status(500).end()
      } else {
        const result = [];

        for (let i = 0; i < docs.length; i++) {
          result.push({
            'id': docs[i].id,
            'name': docs[i].name,
            'slogan': docs[i].slogan,
            'description': docs[i].description,
            'category': docs[i].category,
            'default_price': docs[i].default_price.toString(),
          })
        }
        res.send(result);
      }
    })
  });

  app.get('/products/:product_id', (req, res) => {
    const target = Number(req.params.product_id)
    dbs.product.collection('document_test').find({id: target}).toArray((err, doc) => {
      if (err) {
        res.status(500).end()
      } else {
        const filterFeatures = (array) => {
          for ( let i = 0; i < array.length; i++ ) {
            if (array[i].value === 'null') {
              array[i].value = null
            }
          }
          return array
        }
        const result = {
          'id': doc[0].id,
          'name': doc[0].name,
          'slogan': doc[0].slogan,
          'description': doc[0].description,
          'category': doc[0].category,
          'default_price': doc[0].default_price.toString(),
          'features': filterFeatures(doc[0].features)
        }
        res.send(result)
      }
    })
  });

  app.get('/products/:product_id/styles', (req, res) => {
    const target = Number(req.params.product_id)
    dbs.product.collection('document_test').find({id: target}).toArray((err, doc) => {
      if (err) {
        res.status(500).end()
      } else {

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

        res.send(finalResult(doc[0]))
      }
    })
  })

  return app;
}