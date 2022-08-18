import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // IMPLEMENT A RESTFUL ENDPOINT
  app.get("/filteredimage", async (req , res) => {
    const image_url = req.query.image_url;
    if (image_url) {
      try {
        await filterImageFromURL(image_url).then(response => {
          res.sendFile(response); 
          res.on("finish", function() {
            deleteLocalFiles([response]);
          });
        });
      } 
      catch (error) {
        res.status(500).send({
          status: "failed",
          message: "Something went wrong, troubleshoot.",
          verbose: error
        });
      }
    }
    else {
      res.status(404).send({
        status: "failed",
        message: "Error, not found :("
      });
    }
  });
  // Root Endpoint
  
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send(" Welcome to my  app! try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();