const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const store = new (require('../common/store'))();
const isCookable = require('../common/isCookable');

router.use(bodyParser.urlencoded({ extended : true }));
router.use(bodyParser.json());

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
  if(Number.isNaN(amount) || amount < 0 || amount > 3) { // TODO: maxを設定できるようにする
    res.json({ ok : false, error : 'Parameter invalid' });
    return;
  }
  const cook = await isCookable(req.params.id);
  if(amount > 0 && !cook.ok) res.json(cook);
  else {
    const ok = await store.updateDocInCollection('cookers', req.params.id, {
      amount, displayedAmount : amount
    });
    res.json({ ok });
  }
});

router.get('/:id/displayedAmount', async(req, res) => {
  const cooker = await store.getDocInCollection('cookers', req.params.id);
  res.json(cooker.displayedAmount);
});

router.get('/:id/active', async(req, res) => {
  const cooker = await store.getDocInCollection('cookers', req.params.id);
  res.json(cooker.active);
});
router.put('/:id/active', async(req, res) => {
  const active = parseInt(req.body.active);
  if(active === 0) {
    const ok = await store.updateDocInCollection('cookers', req.params.id, {
      active : false,
      amount : 0
    });
    res.json({ ok });
  }
  else if(active === 1) {
    const ok = await store.updateDocInCollection('cookers', req.params.id, {
      active : true,
      amount : 0
    });
    res.json({ ok });
  }
  else
    res.json({ ok : false, error : 'Parameter invalid' });
});

router.get('/:id/cookable', async(req, res) => {
  res.json(await isCookable(req.params.id));
});

router.get('/:id/isRiceShortage', async(req, res) => {
  const cooker = await store.getDocInCollection('cookers', req.params.id);
  res.json(cooker.isRiceShortage);
});
router.put('/:id/isRiceShortage', async(req, res) => {
  const isRiceShortage = parseInt(req.body.isRiceShortage);
  if(isRiceShortage === 0) {
    const ok = await store.updateDocInCollection('cookers', req.params.id, { isRiceShortage : false });
    res.json({ ok });
  }
  else if(isRiceShortage === 1) {
    const ok = await store.updateDocInCollection('cookers', req.params.id, { isRiceShortage : true });
    res.json({ ok });
  }
  else
    res.json({ ok : false, error : 'Parameter invalid' });
});

router.get('/:id/waste', async(req, res) => {
  const cooker = await store.getDocInCollection('cookers', req.params.id);
  res.json(cooker.waste);
});
router.put('/:id/waste', async(req, res) => {
  const waste = parseInt(req.body.waste);
  if(waste === 0) {
    const ok = await store.updateDocInCollection('cookers', req.params.id, { waste : false });
    res.json({ ok });
  }
  else if(waste === 1) {
    const ok = await store.updateDocInCollection('cookers', req.params.id, { waste : true });
    res.json({ ok });
  }
  else
    res.json({ ok : false, error : 'Parameter invalid' });
});

router.get('/:id/water', async(req, res) => {
  const cooker = await store.getDocInCollection('cookers', req.params.id);
  res.json(cooker.water);
});
router.put('/:id/water', async(req, res) => {
  const water = parseInt(req.body.water);
  if(water === 0) {
    const ok = await store.updateDocInCollection('cookers', req.params.id, { water : false });
    res.json({ ok });
  }
  else if(water === 1) {
    const ok = await store.updateDocInCollection('cookers', req.params.id, { water : true });
    res.json({ ok });
  }
  else
    res.json({ ok : false, error : 'Parameter invalid' });
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
