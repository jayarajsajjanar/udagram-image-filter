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

    it('returns an error when the image_url parameter is not an url', async () => {
        const response = await request(server)
            .get('/filteredimage?image_url=not_an_url')
            .expect(400)

        expect(response.body).toEqual({ error: 'image_url is invalid' })
    })

    afterAll(() => {
        server.close()
    })
})