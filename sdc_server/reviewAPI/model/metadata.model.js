let metadata;

module.exports = {
  injectDB: async (db) => {
    if (metadata) {
      return
    }
    try {
      metadata = await db.collection('dataOnReview');
    } catch(e) {
      console.error(`Unable to establish a collection handle in reviews: ${e}`)
    }
  },
  getMetadata: () => {
  }
}