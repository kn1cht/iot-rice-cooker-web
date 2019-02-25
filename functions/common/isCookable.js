const store = new (require('../store'))();

module.exports = async(id) => {
  const cooker = await store.getDocInCollection('cookers', id);
  if(cooker.amount > 0)
    return({ ok : false, error : 'Cooking is already started' });
  else if(cooker.weight <= -30)
    return({ ok : false, error : 'Weight invalid' });
  else if(cooker.weight >= 30)
    return({ ok : false, error : 'The cooker is not empty' });
  else return { ok : true }
}
