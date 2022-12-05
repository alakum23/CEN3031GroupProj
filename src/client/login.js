if (module.hot) { module.hot.accept(); }
import "./css/login.css";


const form1 = document.getElementById('form1');
form1.style.display = "block";
const form2 = document.getElementById('form2');
form2.style.display = "none";

// var change_class=document.getElementById("active");
// change_class.onclick=function()
// {
//   var icon=document.getElementById("icon");
//   icon.className="fa fa-gear";
// }

const btn = document.getElementById('btn');

function signinFunc(){
    var icon=document.getElementById("icon");
    icon.className="active";

    var icon2=document.getElementById("icon2");
    icon2.className="nonactive";

    if(form1.style.display = "none"){
    form1.style.display = "block";
    form2.style.display = "none";
    }

}

function signUpFunc(){
    var icon=document.getElementById("icon2");
    icon.className="active";

    var icon2=document.getElementById("icon");
    icon2.className="nonactive";

    form1.style.display = "none";
    form2.style.display = "block";
  
}

async function authenticateUser(){
    let us = document.getElementById('username').value;
    let pd = document.getElementById('pwd').value;
    console.log(us);
    console.log(pd);

    //sample fetch request, must post
    let req = await fetch("http://localhost:8080/mongoose/test/find", { // Had an extra slash here
        method: 'PUT',
        json: true, // Tells server this is JSON data
        body: JSON.stringify({
            user: us,
            pass: pd
        }), // JSON stringify is needed to send JSON over the network
    })
    .then((response) => response.json())
    .then((data) => {
        console.log('This is data', data);
        if(data.length > 0){
            console.log("worked");
            // Redirect to viewer page
            location.replace("http://localhost:8080/viewer");
        } else  {
            console.log("wrong answer")
        }
    });
}

async function createUser()  {
    let us = document.getElementById('SUuser').value;
    let pd = document.getElementById('SUpass').value;
    console.log(us);
    console.log(pd);

    let req = await fetch("http://localhost:8080/mongoose/test/add", { // Had an extra slash here
        method: 'PUT',
        json: true, // Tells server this is JSON data
        body: JSON.stringify({
            user: us,
            pass: pd
        }), // JSON stringify is needed to send JSON over the network
    })
    // .then((response) => response.json())
    .then((data) => {
        console.log(data);
        form1.style.display = "block";
        form2.style.display = "none";
    });
}
