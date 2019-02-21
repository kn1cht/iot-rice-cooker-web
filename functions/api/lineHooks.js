const express = require('express');
const router = express.Router();
const store = new (require('../store'))();
const line = require('@line/bot-sdk');
require('dotenv').config();

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_SECRET
};
const client = new line.Client(config);

const handleLineEvent = async event => {
  if (event.type !== 'message' || event.message.type !== 'text')
    return Promise.resolve(null); // ignore non-text-message event
  const echo = { type: 'text', text: event.message.text }; // create a echoing text message
  return await client.replyMessage(event.replyToken, echo);
}

router.post('/', line.middleware(config), async(req, res) => {
  const result = await Promise.all(req.body.events.map(handleLineEvent)).catch((err) => {
    console.error(err);
    res.status(500).end();
  });
  res.json(result);
});

module.exports = router;
