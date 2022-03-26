//Global variables
let searchButton = $("#searchButton");
let savedCitiesCont = $("#savedCities");
let selectedCityCont = $("#selectedCity");
let forecastCont = $("#forcast");
let dataStore = JSON.parse(localStorage.getItem('cities')) || [];
let condition = [];
let icon;
    if (location.protocol === 'http:') {
        icon = 'http://openweathermap.org/img/wn/';
     } else {
        icon = 'https://openweathermap.org/img/wn/';
     }

//Functions for application
function loadCity() {
    cleaningElement(savedCitiesCont);

    if(dataStore){
        let ulElement = document.createElement("ul");
        ulElement.classList.add("list-unstyled");
        ulElement.classList.add("w-100");
        for(let i = 0; i < dataStore.length; i++){
            let liElement = document.createElement("li");
            liElement.innerHTML = "<button type='button' class='list-group-item list-group-item-action' attr='"+dataStore[i]+"'>" + dataStore[i] + "</button>";
            ulElement.appendChild(liElement);
            }
            savedCitiesCont.appendChild(ulElement); 
        }
};

$(document).on("click", ".list-group-item", function(event) {
    event.preventDefault();
    let city = $(this).attr("attr");
    callApiFetch(city);
});