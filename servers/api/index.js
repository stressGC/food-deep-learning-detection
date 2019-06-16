const express = require('express');
const tf = require('@tensorflow/tfjs');
require('dotenv').config();

async function launchServer() {
  const { PORT, MODEL_PATH } = process.env;

  try {
    console.log(`>> LOADING MODEL FROM "file://${MODEL_PATH}"`);
    const model = await tf.loadLayersModel('file://' + MODEL_PATH);
    console.log('>> MODEL LOADED');
  } catch (e) {
    console.log(">> ERROR:", e);
  }


  const app = express();
  app.use('/model', express.static(__dirname + '/public/model'));
  app.get('/predict', (req, res, next) => {
    // res.send(JSON.stringify(model));
  });
  app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
}

launchServer();