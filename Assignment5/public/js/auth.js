import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { setUpConditions } from './db.js';

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
const auth = getAuth(app);

// Listen for auth status changes
onAuthStateChanged(auth, (user) => {
  if(user) {
    setupUI(user);
    showMain();
  } else {
    hideMain();
    setupUI(user);
    setUpConditions([]);
  }
  
});

const hideMain = () => {
  const mainSection = document.querySelector('main');
  const noMainSection = document.querySelector('.no_main');
  mainSection.style.display = 'none';
  noMainSection.style.display = 'block';
}

const showMain = () => {
  const mainSection = document.querySelector('main');
  const noMainSection = document.querySelector('.no_main');
  mainSection.style.display = 'block';
  noMainSection.style.display = 'none';
}

// signup
const signupForm = document.querySelector('#signup-form');
if(signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    // get user info from input
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    createUserWithEmailAndPassword(auth, email, password).then(userCredentials => {
      // signed in
      const user = userCredentials.user;
      const modal = document.querySelector('#modal-signup');
      M.Modal.getInstance(modal).close();
      signupForm.reset();
    }).catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
    signupForm['signup-email'].value = '';
    signupForm['signup-password'].value = '';
  })
}
// logout
const logout = document.querySelectorAll('.logout');
if(logout) {
  logout.forEach(link => {
    link.addEventListener('click', e => {
      // e.preventDefault();
      signOut(auth).then(() => {
        console.log('User has signed out');
      }).catch(error => {
        console.log(error);
      })
    });
  })
}

// login
const loginForm = document.querySelector('#login-form');
if(loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;
    signInWithEmailAndPassword(auth, email, password).then(userCredentials => {
      const user = userCredentials.user;
      const modal = document.querySelector('#modal-login');
      M.Modal.getInstance(modal).close();
      signupForm.reset();
    }).catch(e => {
      alert('Login was invalid.  Try again');
    })
    loginForm['login-email'].value = '';
    loginForm['login-password'].value = '';
  });
}