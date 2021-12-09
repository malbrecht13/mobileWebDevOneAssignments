// setup materialize components
document.addEventListener('DOMContentLoaded', function() {
    const rightSideNav = document.querySelector('.sidenav');
    M.Sidenav.init(rightSideNav,{edge: 'right', draggable: 'true'});

    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);

    var items = document.querySelectorAll(".collapsible");
    M.Collapsible.init(items);

    addListeners();
});



const addListeners = () => {
    rightSideNavCloseBtnListener();
    favoriteStarClickEventListener();
};

const setupUI = user => {
  const loggedOutLinks = document.querySelectorAll('.logged-out');
  const loggedInLinks = document.querySelectorAll('.logged-in');
  if(user) {
    loggedOutLinks.forEach((item) => {
      item.style.display = 'none';
    })
    loggedInLinks.forEach((item) => {
      item.style.display = 'block';
    })
  } else {
    loggedOutLinks.forEach((item) => {
      item.style.display = 'block';
    })
    loggedInLinks.forEach((item) => {
      item.style.display = 'none';
    })
  }
}





const makeCursorAPointer = () => {
  const icons = document.querySelectorAll('i');
  icons.forEach(icon => {
    icon.style.cursor = 'pointer';
  });
  const diseases = document.querySelectorAll('.algo_card_row');
  diseases.forEach(disease => {
    disease.style.cursor = 'pointer';
  });
};

// remove condition from DOM
const removeCondition = (id) => {
  
  const itemToDelete = document.querySelector(`.condition[data-id='${id}']`);
  removeDOMChildren(itemToDelete);
};

// Close right side nav when 'CLOSE' btn is clicked
const rightSideNavCloseBtnListener = () => {
    const closeBtn = document.getElementById('close-right-sidenav');
    const rightSideNav = document.querySelector('.sidenav');
    const sideNavInstance = M.Sidenav.getInstance(rightSideNav);
    closeBtn.addEventListener('click', () => {
        sideNavInstance.close();
    });
    const logoutBtn = document.getElementById('sidenav_logout_btn');
    if(logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        sideNavInstance.close();
      });
    }
};

const eraseMainContent = () => {
    const mainElement = document.querySelector('main');
    removeDOMChildren(mainElement);
};

// Destroy child nodes of a DOM element
const removeDOMChildren = (element) => {
  if(element) {
    while(element.firstChild) {
        element.removeChild(element.lastChild);
    }
  }
};



// Toggles favorite star icon to either star_outline or star upon click
const favoriteStarClickEventListener = () => {
    const favoriteStars = document.querySelectorAll('.favorite-star');
    favoriteStars.forEach(star => {
        star.addEventListener('click', () => {
            // Change to correct star (either filled or not, yellow or white)
            star.innerText === 'star_outline'
            ? star.innerText = 'star'
            : star.innerText = 'star_outline';
            changeFavoriteStarColor(star);          
        });
    });
};


// Change the favorite star's color class
const changeFavoriteStarColor = (star) => {
    if(star.innerText === 'star') {
        star.classList.remove('white-text');
        star.classList.add('yellow-text');
    } else {
        star.classList.remove('yellow-text');
        star.classList.add('white-text');
    }
};









