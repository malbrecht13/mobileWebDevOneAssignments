
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getFirestore, collection, getDocs, onSnapshot, getDoc, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { query, where, updateDoc, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

let showFavorites = false;
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
export const db = getFirestore(app);

enableIndexedDbPersistence(db)
  .catch((err) => {
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          console.log('Persistence failed.');
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          console.log('Persistence is not valid.');
      }
  });

export async function getConditions(db) {
    const conditionCol = collection(db, 'conditions');
    const conditionSnapshot = await getDocs(conditionCol);
    return conditionSnapshot;
}

const unsub = onSnapshot(collection(db, 'conditions'), (doc) => {
    doc.docChanges().forEach(async change => {
        if(change.type === 'added') {
            const conditions_section = document.getElementById('conditions_section');
            removeDOMChildren(conditions_section);
            setUpConditions(doc);
            diseaseClickListener();
            editBtnListener();
        }
        if(change.type === 'modified') {
          diseaseClickListener();
          editBtnListener();
        }
        if(change.type === 'removed') {
            removeCondition(change.doc.id);
            diseaseClickListener();
            editBtnListener();
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
    window.navigator.vibrate([200,100,200]);
    alert('Condition added');
  });
}

// listener for edit button
const editBtnListener = () => {
  const editBtns = document.querySelectorAll('.edit');
  editBtns.forEach(btn => {
    btn.addEventListener('click', async e => {
      const id = e.target.getAttribute('data-id');
      const conditionDoc = await getFirebaseDocById(id);
      fillEditForm(conditionDoc, id);
    });
  })
};

// fills the edit form with the correct values for that condition
const fillEditForm = (condition, id) => {
  const editConditionName = document.getElementById('edit_condition_name');
  const editConditionTreatments = document.getElementById('edit_condition_treatments');
  editConditionName.value = condition.name;
  const treatments = condition.treatments.join('\n');
  editConditionTreatments.value = treatments;
  const editForm = document.querySelector('#edit_condition_form');
  editForm.setAttribute('data-id', id);
};

// edit a condition
const editForm = document.querySelector('#edit_condition_form');
if(editForm) {
  editForm.addEventListener('submit', async e => {
      e.preventDefault();
      const editConditionName = document.getElementById('edit_condition_name');
      const editConditionTreatments = document.getElementById('edit_condition_treatments');
      const id = editForm.getAttribute('data-id');
      const conditionRef = doc(db, 'conditions', id);
      const editModal = document.querySelector('#edit_modal');
      const instance = M.Modal.getInstance(editModal);
      await updateDoc(conditionRef, {
        name: editConditionName.value,
        treatments: editConditionTreatments.value.split('\n')
      });
      instance.close(); // close the edit modal when done
  });
}

// reestablish icon listeners for after rerender
const resetIconListeners = () => {
  setTimeout(() => {
    // delete condition
    const deleteBtns = document.querySelectorAll('.delete');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.target.getAttribute('data-id');
        deleteDoc(doc(db, 'conditions', id));
      });
    });
    // change whether condition is a favorite by clicking on the star icon
    const favoriteStars = document.querySelectorAll('.favorite-star');
    favoriteStars.forEach(star => {
      star.addEventListener('click', async e => {
        const shouldBeFavorite = star.innerText === 'star_outline' ? false : true;
        const id = e.target.getAttribute('data-id');
        const favoriteRef = doc(db, 'conditions', id);
        await updateDoc(favoriteRef, {
          isFavorite: shouldBeFavorite
        });
        rerenderConditions();
      });
    });
    editBtnListener();
    
  },1000);
};


// search a condition
const searchInput = document.getElementById('search');
if(searchInput) {
  searchInput.addEventListener('input', async e => {
    if(e.target.value !== '') { // if the search input field is not blank, show the conditions that match the first letter
      const conditions_section = document.getElementById('conditions_section');
      removeDOMChildren(conditions_section);
      const searchTerm = e.target.value.toUpperCase();
      const nextCharCode = searchTerm.charCodeAt(0) + 1;
      const nextChar = String.fromCharCode(nextCharCode);
      const conditionsRef = collection(db, 'conditions');
      const q = query(conditionsRef, where("name", ">=", searchTerm[0]), where("name", "<=", nextChar));
      const snapshot = await getDocs(q);
      setUpConditions(snapshot);
      resetIconListeners();
      diseaseClickListener();
    } else { // if the search input field is blank, show all of the conditions
      rerenderConditions();
    } 
});
}

// favorites btn listener
const favoritesBtn = document.getElementById('favorites_btn');
if(favoritesBtn) {
  favoritesBtn.addEventListener('click', e => {
    e.stopPropagation();
    showFavorites = true;
    rerenderConditions();
  });
}

// all conditions btn listener
const all_conditions_btn = document.getElementById('all_conditions_btn');
if(all_conditions_btn) {
  all_conditions_btn.addEventListener('click', e => {
    e.stopPropagation();
    showFavorites = false;
    rerenderConditions();
  });
}


const rerenderConditions = async () => {
  const conditions_section = document.getElementById('conditions_section');
      removeDOMChildren(conditions_section);
      const conditionSnapshot = await getConditions(db);
      setUpConditions(conditionSnapshot);
      // conditionSnapshot.forEach(d => {
      //   renderCondition(d.data(), d.id);
      // });
      resetIconListeners();
      diseaseClickListener();
}

// If click on a disease title, will erase main content and display start view of medical algorithm
const diseaseClickListener = () => {
  const diseases = document.querySelectorAll('.disease_title');
  for(let disease of diseases) {
      const id = disease.getAttribute('data-id');
      disease.addEventListener('click', () => {
          eraseMainContent();
          displayTreatments(id);
          window.navigator.vibrate([200,100,200]);
      });
  }
};

// Displays the medical condition treatments page 
const displayTreatments = async (id) => {
  const mainElement = document.querySelector('main');
  const heading = document.createElement('h3');
  const body = document.createElement('p');
  body.classList.add('treatment_body_text');
  const conditionDoc = await getFirebaseDocById(id);
  heading.innerText = conditionDoc.name;
  const treatments = conditionDoc.treatments;
  let treatmentsTxt = '';
  treatments.forEach(treatment => {
    if(treatment.startsWith('**')) {  // if the array item starts with ** I am meaning for it to be a header, otherwise a paragraph
      treatmentsTxt += '<h4>' + treatment.substring(2) + '</h4>' + '\n\n';
    } else {
      treatmentsTxt += '<h5>' + treatment + '</h5>' + '\n';
    }
  });
  body.innerHTML = treatmentsTxt;
  heading.classList.add('page_header');
  mainElement.appendChild(heading);
  mainElement.appendChild(body);
};

const getFirebaseDocById = async id => {
  const docRef = doc(db, 'conditions', id);
  const docSnap = await getDoc(docRef);

  if(docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
  }
};


// populate data when user is signed in
export const setUpConditions = (snapshot) => {
  let displayDiv = document.getElementById('conditions_section');
  let html = '';
  snapshot.forEach((doc) => {
    const condition = doc.data();
    html = `<div class="row condition" data-id=${doc.id}>
    <div class="col s12 m6 offset-m3">
      <div class="card teal darken-4 algo_card z-depth-2">
        <div class="card-content white-text">
            <div class="row algo_card_row">
                <p class="col s10 disease_title" data-id=${doc.id}>${condition.name}</p>   
                <div class="icon_row">  
                  <i class="material-icons favorite-star ${condition.isFavorite ? 'yellow-text' : 'white-text'}" data-id=${doc.id}>${condition.isFavorite ? 'star' : 'star_outline'}</i>
                  <i class="material-icons modal-trigger edit" href="#edit_modal" data-id=${doc.id}>edit</i>
                  <i class="material-icons delete" data-id=${doc.id}>delete</i>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>`;
  if(showFavorites) {
    if(!condition.isFavorite) {
      html = ''; // don't show anything if not a favorite if it's time to show favorites
    }
  }
  if(displayDiv) {displayDiv.innerHTML += html};
  });
  favoriteStarClickEventListener();
  makeCursorAPointer();
  resetIconListeners();
};












