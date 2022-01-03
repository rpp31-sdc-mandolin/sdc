let reviews;

module.exports = {
  injectCollection: async (db) => {
    if (reviews) {
      return
    }
    try {
      reviews = await db.collection('reviews');
    } catch(e) {
      console.error(`Unable to establish a collection handle in reviews: ${e}`)
    }
  },
  getReviews: async (
    page = 0,
    count = 5,
    sort,
    product_id,
  ) => {
    let query;
    if (sort) {
      switch (sort) {
        case 'newest':
          query = {}
          break;
        case 'helpful':
          query = {}
          break;
        case 'relevant':
          query = {}
          break;
        default:
          query = {}
      }
    }

    try {
      await reviews.aggregate(query)
    } catch (e) {
      console.error(e)
    }
  },
  createReview: () => {
  },
  updateHelpful: () => {
  },
  updateReport: () => {
  }
}
