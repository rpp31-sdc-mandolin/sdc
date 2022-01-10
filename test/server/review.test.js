require('regenerator-runtime/runtime');
const request = require('supertest')('http://localhost:3000')

describe('/reviews', () => {
  describe('POST', () => {
    test('should respond with a 201 status code', async () => {
      const res = await request.post('/reviews').send({
          body: 'This onesie feels soft and good for a cold day. However, was a little too big but overall a good purchase',
          date: new Date(),
          helpfulness: 0,
          photos: ["https://images.unsplash.com/photo-1507920676663-3b72429774ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80"],
          product_id: 1000009,
          rating: 5,
          recommend: true,
          reported: false,
          response: null,
          review_id: 0,
          email: 'happyShopper@mail.com',
          name: 'happyShopper',
          summary: 'best purchase',
          characteristics: { '199845': 2, '199846': 3, '199847': 1, '199848': 4 }
      })
      expect(res.statusCode).toBe(201)
      expect(res.created).toBeTruthy()
    })
  })

})


