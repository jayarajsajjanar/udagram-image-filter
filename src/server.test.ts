import request from 'supertest'
import fs from 'fs'
import path from 'path'
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

    it('deletes the temporary image file after sending it', async () => {
        await request(server)
            .get('/filteredimage?image_url=https://timedotcom.files.wordpress.com/2019/03/kitten-report.jpg')
            .expect(200)

            fs.readdir(path.join(__dirname, '/util/tmp/'), (_, files) => {
                expect(files.length).toBe(0)
            })
    })

    afterAll(() => {
        server.close()
    })
})