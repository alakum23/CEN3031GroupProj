/**
 * Sample functions to demo JS functions for use in the *.html ui here
 */

window.buttonClicked = function()  {
    console.log("A button was clicked");
}

window.getFromSearch = function()  {
    var dateInput = document.getElementById('search-date').value;
    var locationInput = document.getElementById('search-location').value;
    var disasterInput = document.getElementById('search-disaster').value;
    console.log(dateInput);
    console.log(locationInput);
    console.log(disasterInput);
        //sample fetch request, must post 
        // await fetch('http://localhost:8080/api/test')
        // .then((response) => response.json())
        // .then((data) => console.log(data));
        // await fetch('http://localhost:8080/NASA/env')
        // .then((response) => response.json())
        // .then((data) => console.log(data));
}