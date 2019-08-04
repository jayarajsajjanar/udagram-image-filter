import request from 'supertest'
import fs from 'fs'
import path from 'path'
import nock from 'nock'
const server = require('./server')

describe('Image filter api', () => {
    describe('filter image', () => {

        beforeEach(() => {
            nock('http://localhost')
                .get('/kitten.jpg')
                .reply(200,
                    fs.readFileSync(path.join(__dirname, '/testdata/kitten.jpg')))
        })
        it('returns the image from the url with the filter applied', async () => {
            const response = await request(server)
                .get('/filteredimage?image_url=http://localhost/kitten.jpg')
                .expect(200)

            expect(response.header['content-type']).toBe('image/jpeg')
        })

        it('deletes the temporary image file after sending it', async () => {
            await request(server)
                .get('/filteredimage?image_url=http://localhost/kitten.jpg')
                .expect(200)

            fs.readdir(path.join(__dirname, '/util/tmp/'), (_, files) => {
                expect(files.length).toBe(0)
            })
        })
    })

    it('returns an error when the image_url parameter is not an url', async () => {
        const response = await request(server)
            .get('/filteredimage?image_url=not_an_url')
            .expect(400)

        expect(response.body).toEqual({ error: 'image_url is invalid' })
    })

    it('returns an error when the image_url parameter is not an image', async () => {
        nock('http://localhost')
            .get('/')
            .reply(200, `I'm not an image url`)

        const response = await request(server)
            .get('/filteredimage?image_url=http://localhost')
            .expect(422)

        expect(response.body).toEqual({ error: 'image_url is not an image' })
    })

    afterAll(() => {
        server.close()
    })
})