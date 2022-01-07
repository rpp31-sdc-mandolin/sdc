const ReviewModel = require('../model/reviews.model.js')

module.exports = {
  apiGetReviews: async (req, res) => {
    const page = req.query.page ? Number(req.query.page) : 0;
    const count = req.query.count ? Number(req.query.count) : 5;
    const sort = req.query.sort ? req.query.sort : 'relevant';
    const product_id = Number(req.query.product_id);

    try {
      const  reviewList  = await ReviewModel.getReviews(page, count, sort, product_id)
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
      date: new Date().toISOString(),
      photos: [],
      product_id: review.product_id,
      rating: review.rating,
      recommend: review.recommend,
      reported: false,
      response: null,
      reviewer_email: review.email,
      reviewer_name: review.name,
      summary: review.summary
    }
    review.photos.forEach(url => part1.photos.push({'url': url}) )

    const part2 = {
      characteristics: [],
      product_id: review.product_id,
      rating: review.rating,
      recommend: review.recommend
    }
    for (let key in review.characteristics) {
      part2.characteristics.push({'id': Number(key), 'value': review.characteristics[key]})
    }

    try {
      const result = await ReviewModel.createReview(part1, part2)
      res.status(201).json({'success': result})
    } catch (e) {
      res.status(500).json({'error': e.message })
    }

  },
  apiUpdateHelpful: async (req, res) => {
    // send response with status 204 no content
  },
  apiUpdateReport: async (req, res) => {
   // send response with status 204 no content
  }
}