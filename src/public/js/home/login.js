"use strict"

const id = document.querySelector("#id");
const psword = document.querySelector("#psword");
const loginBtn = document.querySelector("#button");

loginBtn.addEventListener("click", login );

function login() {

    const req = {
        id: id.value,
        psword: psword.value,
    };

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req)
    })
    .then( (res) => res.json()) // json() promise
    .then( (res) => {
        console.log( res);
        if( res.success ){
            location.href = "/"; 
        } else {
          alert( res.msg ); 
            location.href = "/login"
        }
    })
};