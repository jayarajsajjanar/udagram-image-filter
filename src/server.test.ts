import request from 'supertest'
const server = require('./server')

describe('Image filter api', () => {
    it('returns the image from the url with the filter applied', async () => {
        await request(server)
            .get('/filteredimage?image_url=https://timedotcom.files.wordpress.com/2019/03/kitten-report.jpg')
            .expect(200)
            .then(response => {
                expect(response.header['content-type']).toBe('image/jpeg')
            })
    })

    afterAll(() => {
        server.close()
    })
})