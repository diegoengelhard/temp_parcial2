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
        const buttonClass = data.usrChar.findIndex(uChar => uChar.character.name == element.name) >= 0 ? "removeButton" : "addButton";
        const buttonText = data.usrChar.findIndex(uChar => uChar.character.name == element.name) >= 0 ? "Remove -" : "Add +";
        let card = document.createElement('div');
        let cardContent =
            `<div class="character card">
            <div class="card-cover">
                <figure>
                    <img src="/images/trans1.png" alt="">
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
                <button class="${buttonClass} ${element.name}" data-character='${JSON.stringify(element)}' type="button">${buttonText}</button>
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
                    <img src="/images/falcon11.png" alt="">
                </figure>
            </div>
            <div class="card-body">
                <h2 class="card-title">${element.name}</h2>
                <div class="card-text">
                    <p>Model: ${element.model}</p>
                    <p>Starship class: ${element.starship_class}</p>
                </div>
                <button class="${buttonClass} ${element.name}" data-starship='${JSON.stringify(element)}' type="button">${buttonText}</button>
            </div>
        </div>`;
        card.innerHTML = cardContent;
        return card;
    }
    else {
        return null;
    }
}

const createWrapper = (element) => {
    if (element.url.includes('starships')) {
        let wrapper = document.createElement('div');
        wrapper.classList = "selected-spaceship-wrapper";
        let content =
            `<div class="selected-spaceship-details" data-starship='${JSON.stringify(element)}'>
            <p>${element.name}</p>
            <div class="selected-spaceship-details-img">
                <figure>
                    <img src="/images/falcon11.png" alt="">
                </figure>
            </div>
        </div>`;
        wrapper.innerHTML = content;
        return wrapper;
    }
    else if (element.url.includes('people')) {
        let wrapper = document.createElement('div');
        wrapper.classList = "character-wrapper";
        let content =
            `<p>${element.name}</p>
            <div class="pick-character removeButton" data-character='${JSON.stringify(element)}'>
                <figure>
                    <img src="/images/trans1.png" alt="">
                </figure>
            </div>`;
        wrapper.innerHTML = content;
        return wrapper;
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

/**
 * Obtaining starship information for Starships / Discovery pages
 */
const getStarships = async () => {
    let resultList = [];
    let i = data.offset_starships;
    const api = baseAPI + "/starships/";
    let index = i + 1;
    for (i; i < data.offset_starships + 4; i = i + 1) {
        let finalURL = api + index;
        let data = null;
        while (data == null || data.detail) {
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
 * Obtaining character information for Character / Discovery pages
 */
const getCharacters = async () => {
    let resultList = [];
    let i = data.offset_characters;
    const api = baseAPI + "/people/";
    let index = i + 1;
    for (i; i < data.offset_characters + 4; i = i + 1) {
        let finalURL = api + index;
        let data = null;
        while (data == null || data.detail) {
            data = await fetch(finalURL).then(response => response.json());
            index = index + 1;
            finalURL = api + index;
        }
        resultList.push(data);
    }
    data.offset_characters = i;
    return resultList;
}

/**
 * Shows the selected ships, two at a time
 */
const getFleetShips = (container) => {
    container.innerHTML = '';
    let i = data.offset_usrShips;
    let list = [];
    if (data.usrShips.length >= 1) {
        for (i; i < data.offset_usrShips + 2; i = i + 1) {
            if (data.usrShips[i]) {
                list.push(createWrapper(data.usrShips[i]));
            }
        }
    }
    if (list.length >= 1) {
        list.forEach(item => {
            container.appendChild(item);
        });
    }
    console.log('exiting getFleetShips')
}

/**
 * Shows selected Chars, four at a time
 */
const getFleetChars = (spaceship) => {
    let i = 0;
    let list = [];
    if (data.usrChar.length >= 1) {
        data.usrChar.forEach(crew => {
            if (crew.starship.name == spaceship.name) {
                list.push(createWrapper(crew.character));
                i++;
            };
            if (i % 4 == 0) {
                list.forEach(item => {
                    document.querySelector('.selected-characters-container').appendChild(item);
                })
                return;
            }
        })
        if (list.length >= 1) {
            list.forEach(item => {
                document.querySelector('.selected-characters-container').appendChild(item);
            })
        }
    }
    console.log('Exiting getFleetChars');
}

const getFleetPick = async () => {
    let resultList = [];
    let i = data.offset_characters;
    const api = baseAPI + "/people/";
    let index = i + 1;
    for (i; i < data.offset_characters + 2; i = i + 1) {
        let finalURL = api + index;
        let data = null;
        while (data == null || data.detail) {
            data = await fetch(finalURL).then(response => response.json());
            index = index + 1;
            finalURL = api + index;
        }
        resultList.push(data);
    }
    data.offset_characters = i;
    return resultList;
}

const buttonEventAdd = (element, list) => {
    let check = false;
    list.forEach(item => {
        if (item.name == element.name) check = true;
    })
    if (check) {
        buttonEventRemove(element, list)
    }
    list.push(element);
    saveData();
    const flag = document.getElementsByClassName('YourFleet');
    if (flag.length >= 1) {
        console.log('Editing your fleet');
        let container = document.querySelector('.selected-spaceship');
        getFleetShips(container);
        let selection = document.getElementsByClassName('selected-spaceship-details');
        if (selection.length >= 1) {
            selection = document.querySelector('.selected-spaceship-details');
            selection.classList = 'selected-spaceship-details current-selection';
            getFleetChars(JSON.parse(selection.dataset.starship));
        }
        container = document.querySelector('.cards-container-wrapper');
        showList(i = [info], container);
        console.log('Finished second onload');
    }
}

const buttonEventRemove = (element, list) => {
    const index = list.findIndex(item => item.name == element.name);
    if (index >= 0) {
        list.splice(index, 1);
    }
    else {
        console.log("Element to be removed was not in list")
    }
    document.querySelectorAll(".removeButton." + element.name)
        .forEach(char => {
            char.classList = `addButton ${element.name}`;
            char.innerText = "Remove -"
        })
    saveData();
    const flag = document.getElementsByClassName('YourFleet');
    if (flag.length >= 1) {
        console.log('Editing your fleet');
        let container = document.querySelector('.selected-spaceship');
        getFleetShips(container);
        let selection = document.getElementsByClassName('selected-spaceship-details');
        if (selection.length >= 1) {
            selection = document.querySelector('.selected-spaceship-details');
            selection.classList = 'selected-spaceship-details current-selection';
            getFleetChars(JSON.parse(selection.dataset.starship));
        }
        container = document.querySelector('.cards-container-wrapper');
        showList(i = [info], container);
        console.log('Finished second onload');
    }
}

const cardButtonListener = () => {
    document.addEventListener('click', e => {
        let target = e.target;
        let info;
        if (target.classList.contains('addButton')) {
            e.preventDefault();
            if (target.dataset.starship)
                info = JSON.parse(target.dataset.starship);
            if (!target.dataset.starship)
                info = JSON.parse(target.dataset.character)
            if (info.url.includes('people')) {
                let check = document.getElementsByClassName('YourFleet');
                if (check.length >= 1) {
                    let spaceship = JSON.parse(document.querySelector('.current-selection').dataset.starship);
                    let element = {
                        starship: spaceship,
                        character: info,
                    }
                    buttonEventAdd(element, data.usrChar);
                }
                else {
                    var oldOnLoad = window.onload;
                    window.onload = () => {
                        console.log('Editing your fleet');
                        let container = document.querySelector('.selected-spaceship');
                        getFleetShips(container);
                        let selection = document.getElementsByClassName('selected-spaceship-details');
                        if (selection.length >= 1) {
                            selection = document.querySelector('.selected-spaceship-details');
                            selection.classList = 'selected-spaceship-details current-selection';
                            getFleetChars(JSON.parse(selection.dataset.starship));
                        }
                        container = document.querySelector('.cards-container-wrapper');
                        showList(i = [info], container);
                        console.log('Finished second onload');
                    };
                    window.location.href = "/html/yourfleet.html";
                    window.onload = oldOnLoad;
                }
            }
            else if (info.url.includes('starships')) {
                buttonEventAdd(info, data.usrShips);
            }
        }
    })
}

const fleetSpaceshipListener = () => {
    document.addEventListener('click', e => {
        let target = e.target;
        if (target.classList.contains('current-selection')) {
            return;
        }
        else if (target.classList.contains('selected-spaceship-details')) {
            let temp = document.querySelector('.current-selection');
            temp.classList = "selected-spaceship-details";
            target.classList = "selected-spaceship-details current-selection";
            getFleetChars(JSON.parse(selection.dataset.starship));
        }

    })
}

const addListeners = () => {
    cardButtonListener();
    fleetSpaceshipListener();
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
            offset_usrShips: 0,
            offset_usrChars: 0,
        }
    }

    let pageType = document.getElementsByClassName('Discover');
    if (pageType.length >= 1) {
        const containShips = document.querySelector('.ships-container');
        const ships = getStarships().then(response => showList(response, containShips));
        const containChar = document.querySelector('.character-container');
        const chars = getCharacters().then(response => showList(response, containChar));
        console.log('Entered Discover start up');
        addListeners();
        return;
    }

    pageType = document.getElementsByClassName('Characters');
    if (pageType.length >= 1) {
        const container = document.querySelector('.cards-container-wrapper');
        const list = getCharacters().then(response => showList(response, container))
        console.log('Entered Characters start up');
        addListeners();
        return;
    }

    pageType = document.getElementsByClassName('Starships');
    if (pageType.length >= 1) {
        console.log('Entered Starships start up');
        const container = document.querySelector('.cards-container-wrapper');
        const list = getStarships().then(response => showList(response, container));
        addListeners();
        return;
    }

    pageType = document.getElementsByClassName('YourFleet');
    if (pageType.length >= 1) {
        console.log('Editing your fleet');
        let container = document.querySelector('.selected-spaceship');
        getFleetShips(container);
        let selection = document.getElementsByClassName('selected-spaceship-details');
        if (selection.length >= 1) {
            selection = document.querySelector('.selected-spaceship-details');
            selection.classList = 'selected-spaceship-details current-selection';
            getFleetChars(JSON.parse(selection.dataset.starship));
        }
        container = document.querySelector('.cards-container-wrapper');
        const list = getFleetPick().then(response => showList(response, container));
        addListeners();
        return;
    }

};

/**
 * Adds a function to execute on window loaded
 * @param {function} func 
 */
function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    }
    else {
        window.onload = function () {
            oldonload();
            func();
        }
    }
}

addLoadEvent(App);