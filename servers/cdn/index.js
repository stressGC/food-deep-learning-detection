const express = require('express');
require('dotenv').config();

const app = express();
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', '*');
  res.append('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});
app.use('/model', express.static(__dirname + '/public/model'));
app.listen(process.env.PORT, () => console.log(`App is listening on port ${process.env.PORT}`));