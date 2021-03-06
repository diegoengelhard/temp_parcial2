let data = {};
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

/**
 * Creates a special element for the YourFleet page
 * @param {object} element 
 */
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
};

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
    //data.offset_starships = i;
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
    //data.offset_characters = i;
    return resultList;
}

/**
 * Shows the selected ships, two at a time
 */
// const getFleetShips = (container) => {
//     container.innerHTML = '';
//     let i = data.offset_usrShips;
//     let list = [];
//     if (data.usrShips.length >= 1) {
//         for (i; i < data.offset_usrShips + 2; i = i + 1) {
//             if (data.usrShips[i]) {
//                 list.push(createWrapper(data.usrShips[i]));
//             }
//         }
//     }
//     if (list.length >= 1) {
//         list.forEach(item => {
//             container.appendChild(item);
//         });
//     }
//     console.log('exiting getFleetShips')
// }

/**
 * Shows selected Chars, four at a time
 */
// const getFleetChars = (spaceship) => {
//     let i = 0;
//     let list = [];
//     let container = document.querySelector('.selected-characters-container');
//     container.innerHTML = ``;
//     if (data.usrChar.length >= 1) {
//         data.usrChar.forEach(crew => {
//             if (crew.starship.name == spaceship.name) {
//                 list.push(createWrapper(crew.character));
//                 i++;
//             };
//             if (i % 4 == 0) {
//                 list.forEach(item => {
//                     container.appendChild(item);
//                 })
//                 return;
//             }
//         })
//         if (list.length >= 1) {
//             list.forEach(item => {
//                 container.appendChild(item);
//             })
//         }
//     }
//     console.log('Exiting getFleetChars');
// }

/**
 * Obtains the list for the YourFleet selected ships
 */
// const getFleetPick = async () => {
//     let resultList = [];
//     let i = data.offset_characters;
//     const api = baseAPI + "/people/";
//     let index = i + 1;
//     for (i; i < data.offset_characters + 2; i = i + 1) {
//         let finalURL = api + index;
//         let data = null;
//         while (data == null || data.detail) {
//             data = await fetch(finalURL).then(response => response.json());
//             index = index + 1;
//             finalURL = api + index;
//         }
//         resultList.push(data);
//     }
//     //data.offset_characters = i;
//     return resultList;
// }

/**
 * Adds the object from the corresponding data list
 * @param {object} element 
 * @param {array} list 
 */
// const buttonEventAdd = (element, list) => {
//     let check = false;
//     list.forEach(item => {
//         if (item.character && element.character) {
//             if (item.character.name == element.character.name) check = true;
//         }
//         else if (item.name == element.name) check = true;
//     })
//     if (check) {
//         //This is here just in case the button doesn't update for some reason, it shouldn't execute normally
//         buttonEventRemove(element, list);
//         return;
//     }
//     list.push(element);
//     saveData();
//     const flag = document.getElementsByClassName('YourFleet');
//     if (flag.length >= 1) {
//         console.log('Adding to your fleet');
//         let container = document.querySelector('.selected-spaceship');
//         getFleetShips(container);
//         let selection = document.getElementsByClassName('selected-spaceship-details');
//         if (selection.length >= 1) {
//             yourFleet();
//         }
//         //container = document.querySelector('.cards-container-wrapper');
//         //showList(i = [info], container);
//         console.log('Finished second onload');
//         document.querySelectorAll(".addButton")
//             .forEach(element => {
//                 if (element.classList.contains(element.name)) {
//                     element.classList = `removeButton ${element.name}`;
//                     element.innerText = "Remove -"
//                 }
//             })
//     }
//     else {
//     }
// }

/**
 * Removes the object from the corresponding data list
 * @param {object} element 
 * @param {array} list 
 */
// const buttonEventRemove = (element, list) => {
//     let check = false;
//     list.forEach(item => {
//         if (item.character && element.character) {
//             if (item.character.name == element.character.name) check = true;
//         }
//     })
//     let index = null;
//     if (check) {
//         index = list.findIndex(item => item.character.name == element.character.name);
//     }
//     else {
//         index = list.findIndex(item => item.name == element.name);
//     }
//     if (index >= 0) {
//         list.splice(index, 1);
//     }
//     else {
//         console.log("Element to be removed was not in list")
//     }
//     document.querySelectorAll(".removeButton")
//         .forEach(element => {
//             if (element.classList.contains(element.name)) {
//                 element.classList = `addButton ${element.name}`;
//                 element.innerText = "Add +"
//             }
//         })
//     saveData();
//     const flag = document.getElementsByClassName('YourFleet');
//     if (flag.length >= 1) {
//         yourFleet();
//         console.log('Finished second onload');
//     }
// }

/**
 * Adds a listener to add functionality to add and remove buttons alike
 */
// const cardButtonListener = () => {
//     document.addEventListener('click', e => {
//         let target = e.target;
//         let info;
//         if (target.classList.contains('addButton')) {
//             e.preventDefault();
//             if (target.dataset.starship)
//                 info = JSON.parse(target.dataset.starship);
//             if (!target.dataset.starship)
//                 info = JSON.parse(target.dataset.character)
//             if (info.url.includes('people')) {
//                 let check = document.getElementsByClassName('YourFleet');
//                 if (check.length >= 1) {
//                     if (!document.querySelector('.current-selection')) {
//                         return;
//                     }
//                     let spaceship = JSON.parse(document.querySelector('.current-selection').dataset.starship);
//                     let element = {
//                         starship: spaceship,
//                         character: info,
//                     }
//                     buttonEventAdd(element, data.usrChar);
//                 }
//                 else {
//                     var oldOnLoad = window.onload;
//                     window.onload = () => {
//                         console.log('Editing your fleet');
//                         let container = document.querySelector('.selected-spaceship');
//                         getFleetShips(container);
//                         let selection = document.getElementsByClassName('selected-spaceship-details');
//                         if (selection.length >= 1) {
//                             selection = document.querySelector('.selected-spaceship-details');
//                             selection.classList = 'selected-spaceship-details current-selection';
//                             getFleetChars(JSON.parse(selection.dataset.starship));
//                         }
//                         container = document.querySelector('.cards-container-wrapper');
//                         showList(i = [info], container);
//                         console.log('Finished second onload');
//                     };
//                     window.location.href = "/html/yourfleet.html";
//                     window.onload = oldOnLoad;
//                 }
//             }
//             else if (info.url.includes('starships')) {
//                 let pageType = document.getElementsByClassName('Discover');
//                 if (pageType.length >= 1) {
//                     discover();
//                 }
//                 pageType = document.getElementsByClassName('Starships');
//                 if (pageType.length >= 1) {
//                     starShips();
//                 }
//                 buttonEventAdd(info, data.usrShips);
//             }
//         }
//         else if (target.classList.contains('removeButton')) {
//             e.preventDefault();
//             if (target.dataset.starship)
//                 info = JSON.parse(target.dataset.starship);
//             if (!target.dataset.starship)
//                 info = JSON.parse(target.dataset.character)
//             if (info.url.includes('people')) {
//                 let check = document.getElementsByClassName('YourFleet');
//                 if (check.length >= 1) {
//                     if (!document.querySelector('.current-selection')) {
//                         return;
//                     }
//                     let spaceship = JSON.parse(document.querySelector('.current-selection').dataset.starship);
//                     let element = {
//                         starship: spaceship,
//                         character: info,
//                     }
//                     buttonEventRemove(element, data.usrChar);
//                 }
//                 else {
//                     var oldOnLoad = window.onload;
//                     window.onload = () => {
//                         console.log('Editing your fleet');
//                         let container = document.querySelector('.selected-spaceship');
//                         getFleetShips(container);
//                         let selection = document.getElementsByClassName('selected-spaceship-details');
//                         if (selection.length >= 1) {
//                             selection = document.querySelector('.selected-spaceship-details');
//                             selection.classList = 'selected-spaceship-details current-selection';
//                             getFleetChars(JSON.parse(selection.dataset.starship));
//                         }
//                         container = document.querySelector('.cards-container-wrapper');
//                         showList(i = [info], container);
//                         console.log('Finished second onload');
//                     };
//                     window.location.href = "/html/yourfleet.html";
//                     window.onload = oldOnLoad;
//                 }
//             }
//             else if (info.url.includes('starships')) {
//                 buttonEventRemove(info, data.usrShips);
//                 let pageType = document.getElementsByClassName('Discover');
//                 if (pageType.length >= 1) {
//                     discover();
//                 }
//                 pageType = document.getElementsByClassName('Starships');
//                 if (pageType.length >= 1) {
//                     starShips();
//                 }
//             }
//         }
//     })
// }

/**
 * Adds a listener to change the currently selected starship
 */
// const fleetSpaceshipListener = () => {
//     document.addEventListener('click', e => {
//         let target = e.target;
//         if (target.classList.contains('current-selection')) {
//             return;
//         }
//         else if (target.classList.contains('selected-spaceship-details')) {
//             let temp = document.querySelector('.current-selection');
//             temp.classList = "selected-spaceship-details";
//             target.classList = "selected-spaceship-details current-selection";
//             getFleetChars(JSON.parse(selection.dataset.starship));
//         }
//     })
// }

/**
 * Adds a listener to all pagination elements
 */
// const paginationListener = () => {
//     document.addEventListener('click', e => {
//         let target = e.target;
//         if (target.classList.contains('previous-page')) {
//             if (target.classList.contains('pick-crew-previous')) {
//                 if (data.offset_characters <= 2) {
//                     data.offset_characters = 0;
//                 }
//                 else {
//                     data.offset_characters = data.offset_characters - 2;
//                 }
//                 saveData();
//                 yourFleet();
//             }
//             else if (target.classList.contains('selected-character-previous')) {
//                 if (data.offset_usrChars <= 2) {
//                     data.offset_usrChars = 0;
//                 }
//                 else {
//                     data.offset_usrChars = data.offset_usrChars - 2;
//                 }
//                 saveData();
//                 yourFleet();
//             }
//             else if (target.classList.contains('selected-spaceship-previous')) {
//                 if (data.offset_usrShips <= 2) {
//                     data.offset_usrShips = 0;
//                 }
//                 else {
//                     data.offset_usrShips = data.offset_usrShips - 2;
//                 }
//                 saveData();
//                 yourFleet();
//             }
//             else if (target.classList.contains('previous-characters')) {
//                 if (data.offset_characters <= 4) {
//                     data.offset_characters = 0;
//                 }
//                 else {
//                     data.offset_characters = data.offset_characters - 4;
//                 }
//                 saveData();
//                 characters();
//             }
//             else if (target.classList.contains('previous-characters-discover')) {
//                 if (data.offset_characters <= 4) {
//                     data.offset_characters = 0;
//                 }
//                 else {
//                     data.offset_characters = data.offset_characters - 4;
//                 }
//                 saveData();
//                 discover();
//             }
//             else if (target.classList.contains('previous-starships')) {
//                 if (data.offset_starships <= 4) {
//                     data.offset_starships = 0;
//                 }
//                 else {
//                     data.offset_starships = data.offset_starships - 4;
//                 }
//                 saveData();
//                 starShips();
//             }
//             else if (target.classList.contains('previous-starships-discover')) {
//                 if (data.offset_starships <= 4) {
//                     data.offset_starships = 0;
//                 }
//                 else {
//                     data.offset_starships = data.offset_starships - 4;
//                 }
//                 saveData();
//                 discover();
//             }
//             else {
//                 return;
//             }
//         }
//         else if (target.classList.contains('next-page')) {
//             if (target.classList.contains('pick-crew-next')) {
//                 if (data.offset_characters <= 82 && data.offset_characters >= 80) {
//                     data.offset_characters = 80;
//                 }
//                 else {
//                     data.offset_characters = data.offset_characters + 2;
//                 }
//                 saveData();
//                 yourFleet();
//             }
//             else if (target.classList.contains('selected-character-next')) {
//                 if (data.offset_usrChars <= data.usrChar.length - 1 && data.offset_usrChars >= data.usrChar.length - 3) {
//                     data.offset_usrShips = data.usrChar.length - 3;
//                 }
//                 else if (data.offset_usrChars == data.usrChar.length - 1) {
//                     data.offset_usrChars = data.usrChar.length - 3;
//                 }
//                 else {
//                     data.offset_usrShips = data.offset_usrShips + 2;
//                 }
//                 saveData();
//                 yourFleet();
//             }
//             else if (target.classList.contains('selected-spaceship-next')) {
//                 if (data.offset_usrShips <= data.usrShips.length - 1 && data.offset_usrShips >= data.usrShips.length - 3) {
//                     data.offset_usrShips = data.usrShips.length - 3;
//                 }
//                 else if (data.offset_usrShips == data.usrShips.length - 1) {
//                     data.offset_usrShips = data.usrShips.length - 3;
//                 }
//                 else {
//                     data.offset_usrShips += 2;
//                 }
//                 saveData();
//                 yourFleet();
//             }
//             else if (target.classList.contains('next-characters')) {
//                 if (data.offset_characters <= 82 && data.offset_characters >= 76) {
//                     data.offset_characters = 79;
//                 }
//                 else {
//                     data.offset_characters = data.offset_characters + 4;
//                 }
//                 saveData();
//                 characters();
//             }
//             else if (target.classList.contains('next-characters-discover')) {
//                 if (data.offset_characters <= 82 && data.offset_characters >= 76) {
//                     data.offset_characters = 79;
//                 }
//                 else {
//                     data.offset_characters = data.offset_characters + 4;
//                 }
//                 saveData();
//                 discover();
//             }
//             else if (target.classList.contains('next-starships')) {
//                 if (data.offset_starships <= 75 && data.offset_starships >= 64) {
//                     data.offset_starships = 64;
//                 }
//                 else {
//                     data.offset_starships = data.offset_starships + 4;
//                 }
//                 saveData();
//                 starShips();
//             }
//             else if (target.classList.contains('next-starships-discover')) {
//                 if (data.offset_starships <= 75 && data.offset_starships >= 64) {
//                     data.offset_starships = 64;
//                 }
//                 else {
//                     data.offset_starships = data.offset_starships + 4;
//                 }
//                 saveData();
//                 discover();
//             }
//             else {
//                 return;
//             }
//         }
//     })
// }

/**
 * Adds a listener to the searchbars
 */
const searchListener = () => {
    document.forms.search.addEventListener('submit', async(e) => {
        e.preventDefault();
        let input = document.forms.search.querySelector('input');
        let list = [];
        let pageType = document.getElementsByClassName('Discover');
        if (pageType.length >= 1) {
            let query = baseAPI + "/people/?search=" + input.value;
            let response = await fetch(query).then(response => response.json());
            if(response.results.length > 0){
                let container = document.querySelector('.character-container');
                let i = 0;
                    response.results.forEach(item => {
                        if(i == 4){}
                        else{
                            list.push((item));
                            i++
                        }
                    });
                    showList(list, container);
            }
            else{
                query = baseAPI + "/starships/?search=" + input.value;
                response = await fetch(query).then(response => response.json());
                if(response.results.length > 0){
                    let container = document.querySelector('.ships-container');
                    let i = 0;
                    response.results.forEach(item => {
                        if(i == 4){}
                        else{
                            list.push((item));
                            i++
                        }
                    });
                    showList(list, container);
                }
            }
            return;
        }

        pageType = document.getElementsByClassName('Characters');
        if (pageType.length >= 1) {
            let query = baseAPI + "/people/?search=" + input.value;
            let response = await fetch(query).then(response => response.json());
            if(response.results.length > 0){
                let container = document.querySelector('.cards-container-wrapper');
                let i = 0;
                    response.results.forEach(item => {
                        if(i == 4){}
                        else{
                            list.push((item));
                            i++
                        }
                    });
                    showList(list, container);
            }
            return;
        }

        pageType = document.getElementsByClassName('Starships');
        if (pageType.length >= 1) {
                let query = baseAPI + "/starships/?search=" + input.value;
                let response = await fetch(query).then(response => response.json());
                if(response.results.length > 0){
                    let container = document.querySelector('.cards-container-wrapper');
                    let i = 0;
                    response.results.forEach(item => {
                        if(i == 4){}
                        else{
                            list.push((item));
                            i++
                        }
                    });
                    showList(list, container);
                }
            return;
        }

        pageType = document.getElementsByClassName('YourFleet');
        if (pageType.length >= 1) {
            let query = baseAPI + "/people/?search=" + input.value;
            let response = await fetch(query).then(response => response.json());
            if(response.results.length > 0){
                let container = document.querySelector('.cards-container-wrapper');
                let i = 0;
                    response.results.forEach(item => {
                        if(i == 4){}
                        else{
                            list.push((item));
                            i++
                        }
                    });
                    showList(list, container);
            }
            return;
        }
    })
}

/**
 * Adds all necessary listeners
 */
const addListeners = () => {
    //cardButtonListener();
    //fleetSpaceshipListener();
    //paginationListener();
    searchListener();
}

/**
 * Loading up your fleet html
 */
const yourFleet = () => {
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
}

/**
 * Loading up Discovery HTML
 */

const discover = () => {
    const containShips = document.querySelector('.ships-container');
    const ships = getStarships().then(response => showList(response, containShips));
    const containChar = document.querySelector('.character-container');
    const chars = getCharacters().then(response => showList(response, containChar));
    console.log('Entered Discover start up');
}

/**
 * Loading up Starship HTML
 */
const starShips = () => {
    console.log('Entered Starships start up');
    const container = document.querySelector('.cards-container-wrapper');
    const list = getStarships().then(response => showList(response, container));
}

/**
 * Loading up Characters HTML
 */
const characters = () => {
    console.log('Entered Characters start up');
    const container = document.querySelector('.cards-container-wrapper');
    const list = getCharacters().then(response => showList(response, container));
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
            offset_starships: 0,
            offset_characters: 0,
            offset_fleet_ships: 0,
            offset_usrShips: 0,
            offset_usrChars: 0,
        }
    }

    let pageType = document.getElementsByClassName('Discover');
    if (pageType.length >= 1) {
        discover();
        addListeners();
        return;
    }

    pageType = document.getElementsByClassName('Characters');
    if (pageType.length >= 1) {
        characters();
        addListeners();
        return;
    }

    pageType = document.getElementsByClassName('Starships');
    if (pageType.length >= 1) {
        starShips();
        addListeners();
        return;
    }

    pageType = document.getElementsByClassName('YourFleet');
    if (pageType.length >= 1) {
        yourFleet();
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