const MetaModel = require('../model/metadata.model.js')

module.exports = {
  apiGetMetadata: async (req, res) => {
    const product_id = Number(req.query.product_id);

    try {
      const  metadata  = await MetaModel.getMetadata(product_id)
      let response = {
        product_id: product_id,
        ratings: {},
        recommended: {},
        characteristics: {}
      };
      res.status(201).json(response)
    } catch (e) {
      res.status(500).json({ error: e })
    }
  }
}