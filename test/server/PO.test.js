const {MongoClient} = require('mongodb');
const product = require('../../sdc_server/productAPI/product.js')
import 'regenerator-runtime/runtime'
// import product from '../../sdc_server/productAPI/product.js';

describe ('getAllProducts',  () => {
  it('should find all products', async () => {
    await product.getAllProducts((err, res) => {
      expect(res.length).toBe(5)
    })
  })
})

describe ('getProduct',  () => {

  it('should find a specific product', async () => {
    await product.getProduct(59553, (err, res) => {
      expect(res.id).toBe(59553)
    })
  });

  it('should find the first product', async () => {
    await product.getProduct(1, (err, res) => {
      expect(res.id).toBe(1)
    })
  });

  it('should find the last product', async () => {
    await product.getProduct(1000011, (err, res) => {
      expect(res.id).toBe(1000011)
    })
  });
})

describe ('getProductStyle',  () => {
  it('should find a specific products style information', async () => {
    await product.getProductStyle(503, (err, res) => {
      expect(res.product_id).toBe('503');
      expect(res.results.length).toBe(3)
    })
  })
})



