'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const bodyParser = require('body-parser');
const functions = require('firebase-functions');
const api = require('./api');
require('dotenv').config();

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_SECRET
};
const client = new line.Client(config);
const app = express();
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

const handleLineEvent = async event => {
  if (event.type !== 'message' || event.message.type !== 'text')
    return Promise.resolve(null); // ignore non-text-message event
  const echo = { type: 'text', text: event.message.text }; // create a echoing text message
  return await client.replyMessage(event.replyToken, echo);
}

app.post('/callback', line.middleware(config), async(req, res) => {
  const result = await Promise.all(req.body.events.map(handleLineEvent)).catch((err) => {
    console.error(err);
    res.status(500).end();
  });
  res.json(result);
});

app.use('/api', api);

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

exports.app = functions.https.onRequest(app);
