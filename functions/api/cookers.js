const express = require('express');
const router = express.Router();
const store = new (require('../store'))();

const isCookable = async(id) => {
  const cooker = await store.getDocInCollection('cookers', id);
  if(cooker.weight <= -30)
    return({ ok : false, error : 'Weight invalid' });
  else if(cooker.weight >= 30)
    return({ ok : false, error : 'The cooker is not empty' });
  else return { ok : true }
}

router.get('/', async(req, res) => {
  const cookers = await store.getDocsInCollection('cookers');
  res.json(cookers);
});
router.get('/:id', async(req, res) => {
  const cooker = await store.getDocInCollection('cookers', req.params.id);
  res.json(cooker);
});

router.get('/:id/amount', async(req, res) => {
  const cooker = await store.getDocInCollection('cookers', req.params.id);
  res.json(cooker.amount);
});
router.put('/:id/amount', async(req, res) => {
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

router.get('/:id/active', async(req, res) => {
  const cooker = await store.getDocInCollection('cookers', req.params.id);
  res.json(cooker.active);
});
router.put('/:id/active', async(req, res) => {
  const active = Boolean(req.body.active);
  if(active === undefined) {
    res.json({ ok : false, error : 'Parameter invalid' });
    return;
  }
  const ok = await store.updateDocInCollection('cookers', req.params.id, { active });
  res.json({ ok });
});

router.get('/:id/cookable', async(req, res) => {
  res.json(await isCookable(req.params.id));
});

router.get('/:id/weight', async(req, res) => {
  const cooker = await store.getDocInCollection('cookers', req.params.id);
  res.json(cooker.weight);
});
router.put('/:id/weight', async(req, res) => {
  const weight = parseFloat(req.body.weight);
  if(Number.isNaN(weight) || weight <= -30) {
    res.json({ ok : false, error : 'Parameter invalid' });
    return;
  }
  const ok = await store.updateDocInCollection('cookers', req.params.id, { weight });
  res.json({ ok });
});

module.exports = router;
