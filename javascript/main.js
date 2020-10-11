let data = {};
let searchResult = [];
const baseAPI = 'https://swapi0220.herokuapp.com/api';

/**
 * Creates a card based on the returned query from the API, returns null if the object doesn't exist
 * within the two categories considered below: Characters and Starships
 * @param {object} element 
 */
const createCard = (element) => {
    if (element.url.includes('people')) {
        const buttonClass = data.usrChar.findIndex(uChar => uChar.name == element.name) >= 0 ? "removeButton" : "addButton";
        const buttonText = data.usrChar.findIndex(uChar => uChar.name == element.name) >= 0 ? "Remove -" : "Add +";
        let card = document.createElement('div');
        let cardContent =
            `<div class="character card">
            <div class="card-cover">
                <figure>
                    <img src="./images/trans1.png" alt="">
                </figure>
            </div>
            <div class="card-body">
                <h2 class="card-title">${element.name}</h2>
                <div class="card-text">
                    <p>Gender: ${element.gender}</p>
                    <p>Skin color: ${element.skin_color}</p>
                    <p>Hair color: ${element.hair_color}</p>
                    <p>Birthday: ${element.birth_year}</p>
                </div>
                <button class="${buttonClass}" type="button">${buttonText}</button>
            </div>
        </div>`;
        card.innerHTML = cardContent;
        return card;
    }
    else if (element.url.includes('starships')) {
        const buttonClass = data.usrShips.findIndex(uShip => uShip.name == element.name) >= 0 ? "removeButton" : "addButton";
        const buttonText = data.usrShips.findIndex(uShip => uShip.name == element.name) >= 0 ? "Remove -" : "Add +";
        let card = document.createElement('div');
        let cardContent =
        `<div class="starship card">
            <div class="card-cover">
                <figure>
                    <img src="./images/falcon11.png" alt="">
                </figure>
            </div>
            <div class="card-body">
                <h2 class="card-title">${element.name}</h2>
                <div class="card-text">
                    <p>Model: ${element.model}</p>
                    <p>Starship class: ${element.starship_class}</p>
                </div>
                <button class="${buttonClass}" type="button">${buttonText}</button>
            </div>
        </div>`;
        card.innerHTML = cardContent;
        return card;
    }
    else{
        return null;
    }
}

/**
 * Saves the data to local storage.
 */
const saveData = () => {
    localStorage.setItem('data', JSON.stringify(data));
}

/**
 * Muestra la lista de elementos en forma de cartas, dentro del elemento
 * html 'target'
 * @param {array} list 
 * @param {DOMElement} target 
 */
const showList = (list, target) => {
    target.innerHTML = '';
    list.forEach(element => {
        target.appendChild(createCard(element));
    });
}


const getStarships = async() => {
    let resultList = [];
    let i = data.offset_starships;
    const api = baseAPI + "/starships/";
    let index = i + 1;
    for(i; i < data.offset_starships + 5; i = i + 1){
        let finalURL = api + index;
        let data = null;
        while(data == null || data.detail){
            data = await fetch(finalURL).then(response => response.json());
            index = index + 1;
            finalURL = api + index;
        }
        resultList.push(data);
    }
    data.offset_starships = i;
    return resultList;
}

/**
 * Starting point for the app.
 */
const App = () => {
    console.log('Started App');
    if (localStorage.getItem('data')) {
        data = JSON.parse(localStorage.getItem('data'));
    }
    else {
        data = {
            usrShips: [],
            usrChar: [],
            offset_starships: 1,
            offset_characters: 0,
            offset_fleet_ships: 0,
            offset_fleet_chars: 0,
        }
    }

    let pageType = document.getElementsByClassName('Discover');
    if(pageType.length >= 1){
        console.log('Entered Discover start up');
        return;
    }

    pageType = document.getElementsByClassName('Characters');
    if(pageType.length >= 1){
        console.log('Entered Characters start up');
        return;
    }

    pageType = document.getElementsByClassName('Starships');
    if(pageType.length >= 1){
        console.log('Entered Starships start up');
        const container = document.querySelector('.cards-container-wrapper');
        const list = getStarships().then(response => showList(response, container));
        //showList(list, container)
        return;
    }

    pageType = document.getElementsByClassName('YourFleet');
    return;
};

window.onload = App();