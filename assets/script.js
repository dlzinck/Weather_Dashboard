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
    clearElement(savedCitiesCont);

    if(dataStore){
        let ulElement = $("<ul/>");
        $(ulElement).addClass("list-unstyled");
        $(ulElement).addClass("w-100");
        for(let i = 0; i < dataStore.length; i++){
            let liElement = $("<li/>");
            liElement.innerHTML = "<button type='button' class='list-group-item list-group-item-action' attr='"+dataStore[i]+"'>" + dataStore[i] + "</button>";
            $(ulElement).append(liElement);
            }
            $(savedCitiesCont).append(ulElement); 
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

//This function shows the information that is stored current city and five day forcast
let weatherHTML = function (city, uv) {
    clearElement(selectedCityCont);
    clearElement(forecastCont); 
    let container1 = $("<div/>");
    $(container1).addClass("col-6");
    let container2 = $("<div/>");
    $(container2).addClass("col-6");
    let cityEl = $("<h2/>");
    let imageCurrent = $("<img/>");
    $(cityEl).text(city + " (" + weatherCondition[0].dateT +")");
    $(imageCurrent).attr("src", weatherCondition[0].icon);
    $(imageCurrent).addClass("bg-info");
    $(container1).append(cityEl);
    $(container2).append(imageCurrent);
    let container3  = $("<div/>");
    $(container3).addClass("col-12");
    container3.innerHTML = "<p>Temperature: " + weatherCondition[0].temp + " °F / " + converTemp(weatherCondition[0].temp) + " °C</p>" + 
                           "<p>Humidity: " + weatherCondition[0].humidity + "% </p>" +
                           "<p>Wind Speed: " + weatherCondition[0].speed + " MPH / " + convertWSpeed(weatherCondition[0].speed) + " KPH </p>" +
                           "<p>UV index: <span class='text-white "+ findUV(uv) + "'>" + uv + "</span></p>";
    $(selectedCityCont).append(container1);
    $(selectedCityCont).append(container2);
    $(selectedCityCont).append(container3);
    let container6 = $("<div/>");
    $(container6).addClass("row");
    let container7 = $("<div/>");
    $(container7).addClass("col-12");
    container7.innerHTML = "<h2>5-Day Forecast</h2>";
    $(container6).append(container7);
    $(forecastCont).append(container6);
    let container8 = $("<div/>");
    $(container8).addClass("d-flex");
    for(let i=1; i < weatherCondition.length; i++){    
        let container4  = $("<div/>");
        $(container4).addClass("card");
        $(container4).addClass("bg-primary");
        $(container4).addClass("text-white");
        $(container4).addClass("rounded");
        $(container4).addClass("mr-2");
        $(container4).addClass("flex-fill");
        let container5  = $("<div/>");
        $(container5).addClass("card-body");
        let title = $("<h6/>");
        $(title).addClass("card-title");
        let imageForecast = $("<img/>");
        $(title).text(weatherCondition[i].dateT);
        $(imageForecast).attr("src", weatherCondition[i].icon);
        let pEl1 = $("<p/>");
        let pEl2 = $("<p/>");
        $(pEl1).addClass("small");
        $(pEl1).text("Temperature: " + weatherCondition[i].temp + "°F");
        $(pEl2).addClass("small");
        $(pEl2).text("Humidity: " + weatherCondition[i].humidity + "%");
        $(container5).append(title);
        $(container5).append(imageForecast);
        $(container5).append(pEl1);
        $(container5).append(pEl2)
        $(container4).append(container5);        
        $(container8).append(container4);
    }
    $(forecastCont).append(container8);
};

//This function is designed to store the city
function saveCity(city) {
    let flag = false
    if(dataStore){
        for (let i = 0; i < dataStore.length; i++){
            if(dataStore[i] === city){
                flag = true;
            }
        }
        if(flag){
            displayAlertMessage("The City: "+city+" already exists");
        }
    }
    if(!flag){
        dataStore.push(city);
        localStorage.setItem("cities",JSON.stringify(dataStore));
    }
    loadCity();
}

//This function is designed to search for 0900am
function search9AM(str) {
    let hour = str.split(" ")[1].split(":")[0];
    let flag = false;
    if(hour === "09"){
        flag = true;
    }        
    return flag;
};

function callApiFetch(city) {
    let url;
    if (location.protocol === 'http:') {
        url = 'http://api.openweathermap.org/data/2.5/forecast?appid=b262298fbe39ad30d243f31f6e1297bc&units=imperial&q='+city;
     } else {
        url = 'https://api.openweathermap.org/data/2.5/forecast?appid=b262298fbe39ad30d243f31f6e1297bc&units=imperial&q='+city;
     }
    fetch(url)
    .then(function(weatherResponse) {
        return weatherResponse.json();
     })
    .then(function(weatherResponse) {

        if (weatherResponse.cod != "200") {
            displayAlertMessage("Unable to find "+ city +" in OpenWeathermap.org");
            return;
        } else {
                createDataObject(weatherResponse.list, weatherResponse.city.coord);
            }
            let urlOne;
        if (location.protocol === 'http:') {
            urlOne = 'http://api.openweathermap.org/data/2.5/uvi?appid=b262298fbe39ad30d243f31f6e1297bc&lat='+weatherCondition[0].lat+'&lon='+weatherCondition[0].lon;
        } else {
            urlOne = 'https://api.openweathermap.org/data/2.5/uvi?appid=b262298fbe39ad30d243f31f6e1297bc&lat='+weatherCondition[0].lat+'&lon='+weatherCondition[0].lon;
        }
        fetch(urlOne)
        .then(function(uvResponse) {
          return uvResponse.json();
        })
        .then(function(uvResponse) {
          if (!uvResponse) {
            displayAlertMessage("OpenWeathermap.org could not find information for latitude and longitude");
            return;
          } else {
            saveCity(city);
            weatherHTML(city, uvResponse.value);
          }
        })
    })
    .catch(function(error) {
        displayAlertMessage("We're sorry! We were unable to connect to OpenWeathermap.org");
        return;
    });
};