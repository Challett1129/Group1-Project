//global variables for dom manipulation
const searchValue = document.querySelector("#search");
const searchBtn = document.querySelector("#searchBtn");
const mainBody = document.querySelector("#main");
const cityInput = document.querySelector('#search');
const userInput = document.querySelector('#userInput');
const cityList = document.querySelector("#cityList");
const trailEl = document.querySelector("#trails");
const resultsTitle = document.querySelector("#resultsTitle");
//define searched cities array
let searchedCities = [];



//variable to define the searchedCities array from local storage
if(localStorage.getItem("searches")){
    searchedCities = JSON.parse(localStorage.getItem("searches"));
}

//function to save city search into local storage
const saveSearch = function(search) {
    //takes value of searched item and adds it to array if not a duplicate
    search = search.toLowerCase();
    if(searchedCities.includes(search) == false) {
        searchedCities.push(search);
    }
    if(searchedCities.length == 5) {
        searchedCities.splice(0, 1);
    }
    
    localStorage.setItem("searches", JSON.stringify(searchedCities));

    firstCapital = search.substring(0,1).toUpperCase() + search.substring(1);
    renderSearches();
}
    

//variable to define the searchedCities array from local storage
if(localStorage.getItem("searches")){
    searchedCities = JSON.parse(localStorage.getItem("searches"));
}

// prevent default, reset input box, alert if input empty
let reset = function(event) {
    event.preventDefault();
    let cityName = cityInput.value.trim();
    if (cityName) {
      getLatLong(cityName);
      cityInput.textContent = '';
      cityInput.value = '';
    } else {
      alert('Please enter a city.');
    }
};

//function gets information from api and calls render function to display elements
// let getLatLong = function(cityName) {
//     let weatherAPI = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=65e4e58787a7fd23ec32767cf0dce3ec';
//     fetch(weatherAPI).then(function(response) {
//         if (response.ok) {
//           response.json().then(function(data) {
//             // console.log(data);
//             var latBoi = (data).city.coord.lat;
//             var lonBoi = (data).city.coord.lon;
//             fetch(`https://trailapi-trailapi.p.rapidapi.com/trails/explore/?lon=${lonBoi}&lat=${latBoi}&radius=25`, {
//                 "method": "GET",
//                 "headers": {
//                     "x-rapidapi-key": "53bb73ef70msh2c586d23ef2e24cp1e49c1jsn9741f86cc83c",
//                     "x-rapidapi-host": "trailapi-trailapi.p.rapidapi.com"
//                 }
//             }).then(function (response) {
//                 if (response.ok) {
//                     return response.json();
//                 } else {
//                     return Promise.reject(response);
//                 }
//             }).then(function (Data) {
//                 // console.log(Data);
//                 renderTrails(Data,cityName);
//                 saveSearch(cityName);
//             }).catch(function (error) {
//                 console.warn(error);
//             });
//         })
//         } else {
//         alert("There was a problem with your request!");
//         }
//     }).catch(function(error) {
//         alert('Unable to connect to openweathermap.org.');
//         })
// }

// geocode city name via openweather API
let getLatLong = function(cityName) {
    let weatherAPI = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=65e4e58787a7fd23ec32767cf0dce3ec';
    fetch(weatherAPI).then(function(response) {
        if (response.ok) {
          response.json().then(function(data) {
            console.log(data);
            var latBoi = (data).city.coord.lat;
            var lonBoi = (data).city.coord.lon;
            getTrails(lonBoi, latBoi, cityName);
            })
        } else {
            document.getElementById("error").textContent = "OpenWeatherMap.org could not find that city."
        }
    }).catch(function(error) {
        document.getElementById("error").textContent = ('Unable to connect to OpenWeatherMap.org.');
    })
}

// pass geocoded data into trail API
let getTrails = function(lonBoi, latBoi, cityName) {
            fetch(`https://trailapi-trailapi.p.rapidapi.com/trails/explore/?lon=${lonBoi}&lat=${latBoi}&radius=25`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": "53bb73ef70msh2c586d23ef2e24cp1e49c1jsn9741f86cc83c",
                    "x-rapidapi-host": "trailapi-trailapi.p.rapidapi.com"
                }
            }).then(function (response) {
                if (response.ok) {
                    return response.json();
                } else {
                    document.getElementById("error").textContent = "RapidAPI.com could not locate the requested data."
                    return Promise.reject(response);
                }
            }).then(function (data) {
                console.log(data);
                renderTrails(data, cityName);
                saveSearch(cityName);
            }).catch(function(error) {
                document.getElementById("error").textContent = ('Unable to connect to RapidAPI.com.');
                console.log(error);
            });
};

//function renders api information to the page
const renderTrails = function(results, cityName) {
    trailEl.innerHTML = "";

    resultsTitle.textContent = "Results for :  " + cityName + ", " + results.data[i].region;

    for(i = 0; i < 5; i++) {
        //variable to find park name
        let trailName = document.createElement("div");
        trailName.textContent = results.data[i].name;
        trailName.setAttribute('class', 'trailtitle');
        // This also works: trailName.className += 'b';
       
        console.log(trailName);

        //variable to find park url
        let trailUrl = document.createElement("a");
        let link = document.createTextNode("Click here");
        trailUrl.append(link);
        trailUrl.target = "_blank"
        trailUrl.title = "click here"
        trailUrl.href = results.data[i].url;
        

        //variable to find park length
        let trailLength = document.createElement("div");
        trailLength.textContent = Math.round(results.data[i].length) + " miles";
        trailLength.setAttribute('class', 'traillength');
        // console.log(trailLength);

        //variable to find park region
        // let trailRegion = document.createElement("div")
        // trailRegion.textContent = results.data[i].region;
        // console.log(trailRegion);

        //variable to find park rating
        let trailRatingContainer = document.createElement("div");
        let trailRating = Math.round(results.data[i].rating);
        trailRatingContainer.setAttribute('class', 'trailrating');
        if(trailRating === "" || trailRating === 0){
            trailRatingContainer.textContent = "No rating found"; 
        } else {
            trailRatingContainer.textContent = trailRating + " out of 5 stars";
        }
        console.log(trailRatingContainer);
        

        //creates a div to hold trail's difficulty 
        let trailDifficulty = document.createElement("div"); 
        trailDifficulty.textContent = results.data[i].difficulty;
        trailDifficulty.setAttribute('class', 'traildifficulty');
        

        //creates a container to  store all of the trail's individual information
        let trailContainer = document.createElement("div");
        

        //appends those trails to the page's container
        trailContainer.append(trailName, trailUrl, trailLength, trailDifficulty, trailRatingContainer);
        console.log(trailContainer);
        trailEl.append(trailContainer);
    }
}
    

//creates buttons from strings in savedSearches array 
const renderSearches = function() {
    cityList.innerHTML = "";
    for(i = 0; i < searchedCities.length; i++) {
        let listContent = document.createElement("button");
        let city = searchedCities[i].substring(0,1).toUpperCase() + searchedCities[i].substring(1);
        listContent.textContent = city;
        listContent.addEventListener('click', searchByBtn);
        cityList.append(listContent);

    }
}

//function to add to the recentSearches buttons
const searchByBtn = function(){
    //calls function to get trail data     
    getLatLong(this.textContent);
}

//always prints out savedSearches to page
renderSearches();
//user input
userInput.addEventListener('submit', reset);

