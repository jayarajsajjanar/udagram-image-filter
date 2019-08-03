import request from 'supertest'
const server = require('./server')

describe('Image filter api', () => {
    it('returns OK when calling filteredimage endpoint', async () => {
        await request(server)
            .get('/filteredimage')
            .expect(200)
    })
})