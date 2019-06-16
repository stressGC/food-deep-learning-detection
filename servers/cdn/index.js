const express = require('express');
require('dotenv').config();

const app = express();
app.use('/model', express.static(__dirname + '/public/model'));
app.listen(process.env.PORT, () => console.log(`App is listening on port ${process.env.PORT}`));