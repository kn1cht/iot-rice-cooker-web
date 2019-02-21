const store = new (require('../store'))();

module.exports = async(id) => {
  const cooker = await store.getDocInCollection('cookers', id);
  if(cooker.weight <= -30)
    return({ ok : false, error : 'Weight invalid' });
  else if(cooker.weight >= 30)
    return({ ok : false, error : 'The cooker is not empty' });
  else return { ok : true }
}
