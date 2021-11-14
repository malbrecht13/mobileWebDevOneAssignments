
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, collection, getDocs, onSnapshot, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDbZbucPokXDeUmjdUSrdXnRiAcxjebVUg",
    authDomain: "outpatientmedicalalgorithms.firebaseapp.com",
    projectId: "outpatientmedicalalgorithms",
    storageBucket: "outpatientmedicalalgorithms.appspot.com",
    messagingSenderId: "631424327602",
    appId: "1:631424327602:web:be654a9a2068b1ea7f4eab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getConditions(db) {
    const conditionCol = collection(db, 'conditions');
    const conditionSnapshot = await getDocs(conditionCol);
    return conditionSnapshot.docs;
}

const unsub = onSnapshot(collection(db, 'conditions'), (doc) => {
    doc.docChanges().forEach(change => {
        if(change.type === 'added') {
            renderCondition(change.doc.data(), change.doc.id);
        }
        if(change.type === 'removed') {
            removeCondition(change.doc.id);
        }
    });
});
  

// add a condition
const addForm = document.querySelector('#add_condition_form');
if(addForm) {
  addForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addDoc(collection(db, 'conditions'), {
      isFavorite: false,
      name: event.target.condition_name.value,
      treatments: event.target.condition_treatments.value.split('\n')
    }).catch(e => console.log(e));
    event.target.condition_name.value = '';
    event.target.condition_treatments.value = '';
  });
}

// delete condition
setTimeout(() => {
  const deleteBtns = document.querySelectorAll('.delete');
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.getAttribute('data-id');
      deleteDoc(doc(db, 'conditions', id));
    });
  });
},1000);


