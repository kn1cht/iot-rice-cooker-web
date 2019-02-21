'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const functions = require('firebase-functions');
const api = require('./api');
const app = express();
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.use('/api', api);

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

exports.app = functions.https.onRequest(app);
