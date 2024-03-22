let db;
const request = indexedDB.open("TII Academico", 2);
request.onerror = (event) => {
    console.error("Why didn't you allow my web app to use IndexedDB?!");
};
request.onsuccess = (event) => {
    db = event.target.result;
    console.log('sucesso', event);
};

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    console.log('upgrade', event);

    const objectStore = db.createObjectStore("estudantes", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("nome", "nome", { unique: false });
    objectStore.createIndex("email", "email", { unique: true });

};

function adicionar(estudante) {
    return new Promise((resolve, reject) => {
        let id;
        const transaction = db.transaction(["estudantes"], "readwrite");
        transaction.oncomplete = (event) => {
            resolve(id);
        };
        transaction.onerror = (event) => {
            reject(new Error(event.target.error));
        };
        const objectStore = transaction.objectStore("estudantes");
        const request = objectStore.add(estudante);
        request.onsuccess = (event) => {
            id = event.target.result;
        };
    
    });
}

function listar() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["estudantes"], "readonly");
        transaction.onerror = (event) => {
            reject(new Error(event.target.error));
        };
        const objectStore = transaction.objectStore("estudantes");
        const request = objectStore.getAll();
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    
    });
}

function deletar(id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["estudantes"], "readwrite");
        transaction.onerror = (event) => {
            reject(new Error(event.target.error));
        };
        const objectStore = transaction.objectStore("estudantes");
        const request = objectStore.delete(id);
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    
    });
}