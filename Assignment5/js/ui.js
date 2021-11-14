document.addEventListener('DOMContentLoaded', function() {
    const rightSideNav = document.querySelector('.sidenav');
    M.Sidenav.init(rightSideNav,{edge: 'right', draggable: 'true'});

    addListeners();
});

const addListeners = () => {
    rightSideNavCloseBtnListener();
    diseaseClickListener();
    favoriteStarClickEventListener();
};

const renderCondition = (data, id) => {
    const html = `<div class="row condition" data-id=${id} data-treatments=${data.treatments}>
    <div class="col s12 m6 offset-m3">
      <div class="card teal darken-4 algo_card z-depth-2">
        <div class="card-content white-text">
            <div class="row algo_card_row">
                <p class="col s10 disease_title">${data.name}</p>   
                <i class="material-icons right delete" data-id=${id}>delete</i>
                <i class="material-icons right favorite-star">star_outline</i>
            </div>
        </div>
      </div>
    </div>
  </div>`;
  let displayDiv = document.getElementById('conditions_section');
  displayDiv.innerHTML += html;
  diseaseClickListener();
  favoriteStarClickEventListener();
}

// remove condition from DOM
const removeCondition = (id) => {
  const itemToDelete = document.querySelector(`.condition[data-id=${id}]`);
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
};

const eraseMainContent = () => {
    const mainElement = document.querySelector('main');
    removeDOMChildren(mainElement);
};

// Destroy child nodes of a DOM element
const removeDOMChildren = (element) => {
    while(element.firstChild) {
        element.removeChild(element.lastChild);
    }
};

// If click on a disease title, will erase main content and display start view of medical algorithm
const diseaseClickListener = () => {
    const diseases = document.querySelectorAll('.disease_title');
    for(disease of diseases) {
        const algoName = disease.innerText;
        disease.addEventListener('click', () => {
            eraseMainContent();
            displayAlgo(algoName);
        });
    }
};

// Displays the start view of the algorithm
const displayAlgo = (algoName) => {
    const mainElement = document.querySelector('main');
    const heading = document.createElement('h5');
    const body = document.createElement('p');
    heading.innerText = algoName;
    body.innerText = 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo fugiat excepturi ea consectetur nihil aut quia aliquam, enim minus facilis voluptatum harum error, dignissimos sint accusamus, aliquid est veritatis? Quas.';
    heading.classList.add('page_header');
    mainElement.appendChild(heading);
    mainElement.appendChild(body);
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






