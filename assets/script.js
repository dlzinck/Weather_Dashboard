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
//This function is designed to retrieve the information stored and add information to the search history using an unordered list and for loop
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

//This listener is designed to show current and future weather conditions on the 'click'
$(document).on("click", ".list-group-item", function(event) {
    event.preventDefault();
    let city = $(this).attr("attr");
    callApiFetch(city);
});

//This function is designed to clean everything inside the container
function clearElement(element) {
    element.innerHTML = "";
};

//This function is designed to show if the weather is favorbale, moderate, or severe by using colors based off of the UV Index
function findUV(uv) {
    let indexUV = parseFloat(uv);
    let backgroundColor;
    if(indexUV < 3){
        backgroundColor = "bg-success";
    }
    else if( indexUV < 6){
        backgroundColor = "bg-warning";
    }
        else if(indexUV < 8){
                backgroundColor = "bg-danger";
            }
            else {
                    backgroundColor = "bg-dark";
                }
    return backgroundColor;
};