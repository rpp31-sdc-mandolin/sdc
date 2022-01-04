let reviews;

module.exports = class ReviewModel {
  static async injectDB(client) {
    if (reviews) {
      return;
    }
    try {
      reviews = await client.db('reviewService').collection('reviews');
    } catch(e) {
      console.error(`Unable to establish a collection handle in reviewService: ${e}`)
    }
  }

  static async getReviews(page = 0, count = 5, sort, product_id) {
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
  }
  // async createReview() {
  // }
  // async updateHelpful() {
  // }
  // async updateReport() {
  // }
}
