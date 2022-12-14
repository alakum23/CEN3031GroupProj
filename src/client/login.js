if (module.hot) { module.hot.accept(); }
import "./css/login.css";

const form1 = document.getElementById('form1');
form1.style.display = "block";
const form2 = document.getElementById('form2');
form2.style.display = "none";

window.signinFunc = function()  {
    document.getElementById("icon").className = "active";
    document.getElementById("icon2").className="nonactive";

    form1.style.display = "block";
    form2.style.display = "none";
}

window.signUpFunc = function()  {
    document.getElementById("icon2").className="active";
    document.getElementById("icon").className="nonactive";

    form1.style.display = "none";
    form2.style.display = "block";
}

window.authenticateUser = async function()  {
    let us = document.getElementById('username').value;
    let pd = document.getElementById('pwd').value;
    console.log(us);
    console.log(pd);
    // Should probably encode this huh?

    //sample fetch request, must post
    fetch("http://localhost:8080/mongoose/user/find", { // Had an extra slash here
        method: 'PUT',
        json: true, // Tells server this is JSON data
        body: JSON.stringify({
            user: us,
            pass: pd
        }), // JSON stringify is needed to send JSON over the network
    })
    .then((response) => {
        if (!response.ok) {
            // create error object and reject if not a 2xx response code
            let err = new Error("HTTP status code: " + response.status)
            err.response = response
            err.status = response.status
            throw err
        }
        return response.json();
    })
    .then((data) => {
        // Completed successfully so redirect...
        location.replace("http://localhost:8080/viewer");
    })
    .catch((error) =>  {
        // Handle any login error here...
        alert("Invalid user credentials!");
        console.log(error);
    })
}

window.createUser = async function()  {
    let us = document.getElementById('SUuser').value;
    let pd = document.getElementById('SUpass').value;
    console.log(us);
    console.log(pd);

    fetch("http://localhost:8080/mongoose/user/add", { // Had an extra slash here
        method: 'PUT',
        json: true, // Tells server this is JSON data
        body: JSON.stringify({
            user: us,
            pass: pd
        }), // JSON stringify is needed to send JSON over the network
    })
    .then((response) => {
        if (!response.ok) {
            // create error object and reject if not a 2xx response code
            let err = new Error("HTTP status code: " + response.status)
            err.response = response
            err.status = response.status
            throw err
        }
        return response.json();
    })
    .then((data) => {
        // Let user know they were added successfully
        // Go back to sign in page
        console.log(data);
        form1.style.display = "block";
        form2.style.display = "none";
    })
    .catch((error) =>  {
        // Handle any login error here...
        alert("Unable to create new account!");
        console.log(error);
    })
}
