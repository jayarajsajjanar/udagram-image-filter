import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  app.get("/filteredimage", async (req, res) => {
    const { image_url: imageUrl } = req.query

    if (!isUrl(imageUrl)) {
      return res.status(400).send({ error: 'image_url is invalid' })
    }

    if (!isImage(imageUrl)) {
      return res.status(422).send({ error: 'image_url is not an image' })
    }

    try {
      const img = await filterImageFromURL(imageUrl)
      return res.sendFile(img, async () => {
        await deleteLocalFiles([img])
      })
    } catch (e) {
      return res.status(422).send({ error: 'image_url could not be processed' })
    }
  });

  const isUrl = (imageUrl: string) => {
    try {
      new URL(imageUrl)
      return true
    } catch (e) {
      return false
    }
  }

  const isImage = (imageUrl: string) => {
    return imageUrl.match(/\.(jpeg|jpg|gif|png)$/);
  }

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  const server = app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });

  module.exports = server
})();


