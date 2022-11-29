/**
 * Sample functions to demo JS functions for use in the *.html ui here
 */

window.buttonClicked = function()  {
    console.log("A button was clicked");
}

window.getFromSearch = async function()  {
    // Get info from the UI parts
    const dateInput = document.getElementById('search-date').value;
    const locationInput = document.getElementById('search-location').value;
    const disasterInput = document.getElementById('search-disaster').value;
    console.log(dateInput);

    // TO DO: get inputs for location bbox and for disaster types
    console.log(locationInput);
    console.log(disasterInput);

    // Make the POST request options
    const options = {
        method: 'POST',
        json: true, 
        body: JSON.stringify({
            "start": dateInput,
            "end": dateInput
        })
    };

    // Get the new disaster data
    fetch('http://localhost:8080/NASA/disasters', options)
        .then(value =>  value.json())
        .then(data =>  {
            console.log(data)
        });
   
}
