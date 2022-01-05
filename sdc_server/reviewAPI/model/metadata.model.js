let metadata;

module.exports = {
  injectDB: async (client) => {
    if (metadata) {
      return
    }
    try {
      metadata = await client.db('reviewService').collection('dataOnReview');
    } catch(e) {
      console.error(`Unable to establish a collection handle in dataOnReview: ${e}`)
    }
  },
  getMetadata: async () => {
  }
}