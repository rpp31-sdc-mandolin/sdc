const ReviewModel = require('../model/reviews.model.js')
const MetaModel = require('../model/metadata.model.js')

module.exports = {
  apiGetReviews: async (req, res) => {
    const page = req.query.page ? Number(req.query.page) : 0;
    const count = req.query.count ? Number(req.query.count) : 20;
    const sort = req.query.sort ? req.query.sort : 'relevant';
    const product_id = Number(req.query.product_id);

    try {
      const reviewList = await ReviewModel.getReviews(page, count, sort, product_id)
      let response = {
        product: product_id,
        page: page,
        count: count,
        results: reviewList
      }
      res.status(200).json(response)
    } catch (e) {
      res.status(500).json({ error: e })
    }
  },
  apiPostReview: async (req, res) => {
    const review = req.body;
    const part1 = {
      body: review.body,
      date: new Date(),
      helpfulness: 0,
      photos: [],
      product_id: Number(review.product_id),
      rating: Number(review.rating),
      recommend: Boolean(review.recommend),
      reported: false,
      response: null,
      review_id: 0,
      reviewer_email: review.email,
      reviewer_name: review.name,
      summary: review.summary
    }
    const newReviewId = await ReviewModel.getLastInsertedDoc() + 1;
    part1.review_id = newReviewId;
    review.photos.forEach(url => part1.photos.push({'url': url}) )

    const part2 = {
      _id: 0,
      characteristics: [],
      product_id: review.product_id,
      rating: review.rating,
      recommend: review.recommend
    }
    part2._id = newReviewId;
    for (let key in review.characteristics) {
      const found = await MetaModel.getCharsName(Number(key))
      part2.characteristics.push({'id': Number(key), 'name': found, 'value': review.characteristics[key]})
    }

    try {
      const result = await ReviewModel.createReview(part1, part2)
      res.status(201).json({'success': result})
    } catch (e) {
      res.status(500).json({'error': e.message })
    }

  },
  apiUpdateHelpful: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await ReviewModel.updateHelpful(Number(id))
      res.json({ status: 'Updated' })
    } catch (e) {
      res.status(500).json({ 'error': e.message })
    }
  },
  apiUpdateReport: async (req, res) => {
    const { id } = req.params;
    try {
      const response = await ReviewModel.updateReport(Number(id))
      res.json({ status: 'Reported' })
    } catch (e) {
      res.status(500).json({ 'error': e.message })
    }
  }
}