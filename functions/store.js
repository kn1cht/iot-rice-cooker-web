
const admin = require('firebase-admin');
const serviceAccount = require('./key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

class Store {
  constructor() {
    this.db = admin.firestore();
  }
  async getDocsInCollection(name, query = []) {
    const result = {};
    let ref = this.db.collection(name);
    if(query.length)
      for(let q of query) ref = ref.where(q.field, q.operator, q.data); // { field, operator, data }

    const snapshot = await ref.get().catch((err) => console.error(err));
    snapshot.forEach((doc) => {
      result[doc.id] = doc.data();
    });
    return result;
  }
  async getDocInCollection(cName, dName) {
    const doc = await this.db.doc(`${cName}/${dName}`)
      .get().catch((err) => console.error(err));
    return (doc.exists ? doc.data() : {});
  }
  async updateDocInCollection(cName, dName, data) {
    await this.db.doc(`${cName}/${dName}`)
      .update(data).catch((err) => {
        console.error(err);
        return false;
      });
    return true;
  }
}

module.exports = Store;
