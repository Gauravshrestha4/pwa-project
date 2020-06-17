var dbPromise = idb.open('posts-store', 1, function (db) {
    if (!db.objectStoreNames.contains('posts')) {
      db.createObjectStore('posts', { keyPath: 'id' });
    }
})
  
function writeData(st,data) {
    console.log('write called');         
    return dbPromise.then(db => {
        let tx = db.transaction(st, 'readwrite');
        var store = tx.objectStore(st)
        console.log('inside store',data)
        store.put(data);
        return tx.complete;
      })
}

function readAllData(st) {
    console.log('read')
    return dbPromise.then(db => {
        let tx = db.transaction(st, 'readonly');
        var store = tx.objectStore(st);
        return store.getAll();
    })
}
function clearAllData(st) {
    return dbPromise.then(db => {
        let tx = db.transaction(st, 'readwrite');
        var store = tx.objectStore(st);
        store.clear();
        return tx.complete;
    })
}
function deleteFromData(st,id) {
    dbPromise.then(db => {
        let tx = db.transaction(st, 'readwrite');
        let store = tx.objectStore(st);
        store.delete(id)
        return tx.complete
    })
    .then(
        console.log('data deleted')
    )
    
}