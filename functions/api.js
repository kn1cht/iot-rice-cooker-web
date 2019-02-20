const express = require('express');
const router = express.Router();
const store = new (require('./store'))();

router.get('/', (req, res) => {
  res.header('Content-Type', 'application/json; charset=utf-8');
  res.send('This is IoT Rice API');
});
router.post('/', (req, res) => {
  res.header('Content-Type', 'application/json; charset=utf-8');
  res.send('This is IoT Rice API');
});
router.put('/', (req, res) => {
  res.header('Content-Type', 'application/json; charset=utf-8');
  res.send('This is IoT Rice API');
});

const isCookable = async(id) => {
  const cooker = await store.getDocInCollection('cookers', id);
  if(cooker.weight <= -30)
    return({ ok : false, error : 'Weight invalid' });
  else if(cooker.weight >= 30)
    return({ ok : false, error : 'The cooker is not empty' });
  else return { ok : true }
}

router.get('/cookers', async(req, res) => {
  const cookers = await store.getDocsInCollection('cookers');
  res.json(cookers);
});
router.get('/cookers/:id', async(req, res) => {
  const cooker = await store.getDocInCollection('cookers', req.params.id);
  res.json(cooker);
});

router.get('/cookers/:id/amount', async(req, res) => {
  const cooker = await store.getDocInCollection('cookers', req.params.id);
  res.json(cooker.amount);
});
router.put('/cookers/:id/amount', async(req, res) => {
  const amount = parseInt(req.body.amount);
  if(Number.isNaN(amount) || amount < 0 || amount > 3) { // TODO: maxを設定する
    res.json({ ok : false, error : 'Parameter invalid' });
    return;
  }
  const cook = await isCookable(req.params.id);
  if(amount > 0 && !cook.ok) res.json(cook);
  else {
    const ok = await store.updateDocInCollection('cookers', req.params.id, { amount });
    res.json({ ok });
  }
});

router.get('/cookers/:id/active', async(req, res) => {
  const cooker = await store.getDocInCollection('cookers', req.params.id);
  res.json(cooker.active);
});
router.put('/cookers/:id/active', async(req, res) => {
  const active = Boolean(req.body.active);
  if(active === undefined) {
    res.json({ ok : false, error : 'Parameter invalid' });
    return;
  }
  const ok = await store.updateDocInCollection('cookers', req.params.id, { active });
  res.json({ ok });
});

router.get('/cookers/:id/cookable', async(req, res) => {
  res.json(await isCookable(req.params.id));
});

router.get('/cookers/:id/weight', async(req, res) => {
  const cooker = await store.getDocInCollection('cookers', req.params.id);
  res.json(cooker.weight);
});
router.put('/cookers/:id/weight', async(req, res) => {
  const weight = parseFloat(req.body.weight);
  if(Number.isNaN(weight) || weight <= -30) {
    res.json({ ok : false, error : 'Parameter invalid' });
    return;
  }
  const ok = await store.updateDocInCollection('cookers', req.params.id, { weight });
  res.json({ ok });
});

module.exports = router;
