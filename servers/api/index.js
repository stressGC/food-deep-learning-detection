const express = require('express');
const tf = require('@tensorflow/tfjs');
require('dotenv').config();

const launchServer = async () => {
  const { PORT, MODEL_PATH } = process.env;

  console.log(`>> LOADING MODEL FROM ${MODEL_PATH}`);
  const model = await tf.loadGraphModel(MODEL_PATH);
  console.log('>> MODEL LOADED');

  const app = express();
  app.get('/predict', async (req, res, next) => {
    // const predictions = model.predict(tensor).data();
    // model.predict()
    // res.json(model);
    res.send("prediciton");
  });
  app.listen(PORT, () => {
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Approximate usage: ${Math.round(used * 100) / 100} MB`);
    console.log(`App is listening on port ${PORT}`);
  });
};

launchServer();