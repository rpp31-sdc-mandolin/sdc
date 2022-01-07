const MetaModel = require('./metadata.model.js');
let reviews;

module.exports = {
  injectDB: async (client) => {
    if (reviews) {
      return;
    }
    try {
      reviews = await client.db('reviewService').collection('reviews');
    } catch(e) {
      console.error(`Unable to establish a collection handle in reviewService: ${e}`)
    }
  },
  getReviews: async (page = 0, count = 5, sort, product_id) => {
    let pipeline = [{ $match: { 'product_id': product_id }}]
    if (sort) {
      switch (sort) {
        case 'newest':
          pipeline.push({ '$sort': { 'date': -1 } })
          break;
        case 'helpful':
          pipeline.push({ '$sort': { 'helpfulness': -1 } })
          break;
        case 'relevant':
          pipeline.push({ '$sort': { 'helpfulness': -1, 'date': -1 } })
          break;
      }
    } else {
      pipeline.push({ '$sort': { 'helpfulness': -1, 'date': -1 }})
    }

    let aggCursor;
    try {
      aggCursor = await reviews.aggregate(pipeline)
    } catch (e) {
      console.error(`Uhhh, unable to proceed aggregation, ${e}`)
      return { results: [] }
    }

    const displayCursor = aggCursor.limit(count).skip(count * page)
    try {
      const reviewList = await displayCursor.toArray();
      return reviewList;
    } catch (e) {
      console.error(`Uhhh, unable to convert cursor to array, ${e}`)
      return { results: [] }
    }
  },
  createReview: async (part1, part2) => {
    try {
      const cursorA = await reviews.insertOne(part1)
      part2['_id'] = cursorA.insertedId;

      return await MetaModel.addMetadata(part2)
    } catch (e) {
      console.error(`Uhhh, unable to post review ${e}`)
      return { 'error': e }
    }
  },
  updateHelpful: () => {
  },
  updateReport: () => {
  }
}
