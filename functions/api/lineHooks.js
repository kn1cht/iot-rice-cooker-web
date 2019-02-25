const express = require('express');
const router = express.Router();
const line = require('@line/bot-sdk');
require('dotenv').config();
const store = new (require('../store'))();
const isCookable = require('../common/isCookable');

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_SECRET
};
const client = new line.Client(config);

const startCooking = async data => {
  const {amount, cookerId, cookerName} = data;
  let text = '';
  if(Number.isNaN(amount) || amount < 0 || amount > 3) // TODO: maxを設定
    text = '炊飯量が正しくありません。';
  else {
    const cook = await isCookable(cookerId);
    if(amount > 0 && !cook.ok)
      text = `[${cookerName}]\n開始できませんでした。`;
    else {
      const ok = await store.updateDocInCollection('cookers', cookerId, { amount });
      text = ok ? `[${cookerName}]\n${amount}合で炊飯を開始します。` : `[${cookerName}]\n開始できませんでした。`;
    }
  }
  return text;
}

const handleCooking = (event, client, cooker, cookerId) => {
  if(cooker.weight <= -30)
    return client.replyMessage(event.replyToken, { type : 'text', text : 'Weight invalid' });
  else if(cooker.weight >= 30) {
    return client.replyMessage(event.replyToken, {
      type : 'text',
      text : `[${cooker.name}]\n内釜にご飯が残っているため開始できません。\nご飯の量：${cooker.weight} g`
    });
  }
  else {
    return client.replyMessage(event.replyToken, {
      type     : 'template',
      altText  : 'Suihan Menu Buttons',
      template : {
        type    : 'buttons',
        text    : `[${cooker.name}]\n炊飯を開始できます。何合炊きますか？`,
        actions : [
          {
            type  : 'postback',
            label : '1合',
            data  : JSON.stringify({ amount : 1, cookerId, cookerName : cooker.name })
          },
          {
            type  : 'postback',
            label : '2合',
            data  : JSON.stringify({ amount : 2, cookerId, cookerName : cooker.name })
          },
          {
            type  : 'postback',
            label : '3合',
            data  : JSON.stringify({ amount : 3, cookerId, cookerName : cooker.name })
          }
        ]
      }
    });
  }
}

const handleLineEvent = async event => {
  if (event.type !== 'message' && event.type !== 'postback') return Promise.resolve(null);
  if(event.type === 'postback') {
    console.log(JSON.parse(event.postback.data));  // TODO: 同じメッセージのデータは受けないようにする
    return client.replyMessage(event.replyToken, {
      type : 'text',
      text : await startCooking(JSON.parse(event.postback.data))
    });
  }
  else {
    if(event.message.type !== 'text') return Promise.resolve(null);
    const userList = await store.getDocsInCollection('users', '', [{
      field    : 'line.userId',
      operator : '==',
      data     : 'xxxxxx' // TODO:暫定userid
    }]);
    const user = userList[Object.keys(userList)[0]];
    const cookerDoc = await user.cookers[user.defaultCooker].get().catch((err) => console.error(err));
    const cooker = cookerDoc.data();
    const cookerId = cookerDoc.id;
    console.log(`Service User: ${user.name} Default Cooker: ${cooker.name}`);

    if(event.message.text.match(/炊飯/))
      return handleCooking(event, client, cooker, cookerId);
    else {
      const cookable = (cooker.amount === 0 && cooker.weight < 30 && cooker.weight > -30);
      const statusText = cookable ? '炊飯できます。' : (cooker.amount ? '炊飯中です。' : '炊飯完了しました。');
      return client.replyMessage(event.replyToken, {
        type : 'text',
        text : `[${cooker.name}]\n${statusText}\nご飯の量は現在${cooker.weight} gです。`
      });
    }
  }
}

router.post('/', line.middleware(config), async(req, res) => {
  const result = await Promise.all(req.body.events.map(handleLineEvent)).catch((err) => {
    console.error(err);
    res.status(500).end();
  });
  res.json(result);
});

module.exports = router;
