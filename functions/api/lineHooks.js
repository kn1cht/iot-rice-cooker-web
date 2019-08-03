const express = require('express');
const path = require('path');
const router = express.Router();
const line = require('@line/bot-sdk');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const store = new (require('../common/store'))();
const isCookable = require('../common/isCookable');
const messages = require('./lineMessages');

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
      const ok = await store.updateDocInCollection('cookers', cookerId, { amount, displayedAmount : amount });
      text = ok ? `[${cookerName}]\n${amount}合で炊飯を開始します。` : `[${cookerName}]\n開始できませんでした。`;
    }
  }
  return text;
}

const handleCooking = (event, client, cooker, cookerId, skipWarning) => {
  if(cooker.weight <= -30) {
    return client.replyMessage(event.replyToken, {
      type : 'text',
      text : `[${cooker.name}]\n内釜が装着されていない可能性があるため開始できません。\nご飯の量：${cooker.weight} g`
    });
  }
  else if(cooker.weight >= 30) {
    return client.replyMessage(event.replyToken, {
      type : 'text',
      text : `[${cooker.name}]\n内釜にご飯が残っているため開始できません。\nご飯の量：${cooker.weight} g`
    });
  }
  else if((!cooker.water || cooker.waste || cooker.isRiceShortage) && !skipWarning) {
    const dataTemplate = {
      cookerId,
      cookerName : cooker.name,
      token : event.replyToken
    };
    let text = `[${cooker.name}]\n以下の警告が発生しています。本当に開始してもよろしいですか？`;
    text += messages.warningText(cooker);
    return client.replyMessage(event.replyToken, messages.confirmTemplate(dataTemplate, text));
  }
  else {
    const dataTemplate = {
      action : 'start',
      cookerId,
      cookerName : cooker.name,
      token : event.replyToken
    };
    const text = `[${cooker.name}]\n炊飯を開始できます。何合炊きますか？`;
    return client.replyMessage(event.replyToken, messages.menuTemplate(dataTemplate, text));
  }
}

const handlePostBackAction = async (event, data) => {
  if(data.action === 'start') {
    client.replyMessage(event.replyToken, {
      type : 'text',
      text : await startCooking(data)
    });
  }
  else if(data.action === 'confirm') {
    const cooker = await store.getDocInCollection('cookers', data.cookerId);
    handleCooking(event, client, cooker, data.cookerId, true);
  }
  else if(data.action === 'cancel') {
    client.replyMessage(event.replyToken, { type : 'text', text : 'キャンセルしました' });
  }
  return await store.setDocInCollection('replies', data.token, { used : true });
}

const handleLineEvent = async event => {
  if (event.type !== 'message' && event.type !== 'postback') return Promise.resolve(null);
  if(event.type === 'postback') {
    const reply = await store.getDocInCollection('replies', JSON.parse(event.postback.data).token);
    if(reply.used !== void 0) return Promise.resolve(null); // avoid duplicate actions for the same message
    else return await handlePostBackAction(event, JSON.parse(event.postback.data));
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
      return handleCooking(event, client, cooker, cookerId, false);
    else {
      const cookable = (cooker.amount === 0 && cooker.weight < 30 && cooker.weight > -30);
      let text = `[${cooker.name}]\n${cookable ? '炊飯できます。' : (cooker.amount ? '炊飯中です。' : '炊飯完了しました。')}`;
      text += `\nご飯の量は現在${cooker.weight} gです。`
      text += messages.warningText(cooker);
      return client.replyMessage(event.replyToken, { type : 'text', text });
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
