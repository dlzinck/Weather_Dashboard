//Global variables
let searchButton = document.querySelector("#searchButton");
let savedCitiesCont = document.querySelector("#savedCities");
let selectedCityCont = document.querySelector("#selectedCity");
let forecastCont = document.querySelector("#forcast");
let dataStore = JSON.parse(localStorage.getItem('cities')) || [];
let condition = [];
let icon;
    if (location.protocol === 'http:') {
        icon = 'http://openweathermap.org/img/wn/';
     } else {
        icon = 'https://openweathermap.org/img/wn/';
     }
