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
  getReviews: () => {
  },
  postReviewData: () => {
  },
  markReviewHelpful: () => {
  },
  reportReview: () => {
  }
}
