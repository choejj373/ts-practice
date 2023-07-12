"use strict"

const id = document.querySelector("#id");
const name = document.querySelector("#name");
const psword = document.querySelector("#psword");
const pswordConfirm = document.querySelector("#psword-confirm");
const registerBtn = document.querySelector("#button");



registerBtn.addEventListener("click", register );

function register() {

    if( !id.value ) return alert("아이디를 입력해주세요");
    if( psword.value !== pswordConfirm.value ){
        return alert("패스워드가 다릅니다");
    }
   
    // pswordConfirm: pswordConfirm.value,

    const req = {
        id: id.value,
        name: name.value,
        psword: psword.value,
        
    };

   console.log( req.id + req.name + req.psword );

    fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req)
    })
    .then( (res) => res.json()) // json() promise
    .then( (res) => {
        //console.log( res);
        if( res.success ){
            location.href = "/";
        } else {
          alert( res.msg ); //=> cathc 발생
          //  location.href = "/login"
        }
    })
};