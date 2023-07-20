
import { processResponseFail, showMainView, getUserInfo, showLoginView, g_publicKey } from './home.js'

//서버에서 발급받은 게스트 계정 저장
let guestId = undefined;

const loginId = document.getElementById("loginId");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");
const googleLoginBtn = document.getElementById('googleLoginBtn');
const guestLoginBtn = document.getElementById("guestLoginBtn");

guestLoginBtn.addEventListener("click", guestLogin );
googleLoginBtn.addEventListener("click", googleLogin );
loginBtn.addEventListener("click", login );


const registerId = document.getElementById("registerId");
const registerName = document.getElementById("registerName");
const registerPsword = document.getElementById("registerPsword");
const registerPswordConfirm = document.getElementById("registerPswordConfirm");
const registerBtn = document.getElementById("registerBtn");

registerBtn.addEventListener("click", registerAccount );



function getValueEncodedByPublicKey( text)
{

    var crypt = new JSEncrypt();

    console.log( g_publicKey );
    // // 키 설정
    crypt.setPublicKey(g_publicKey);

    // // 암호화
    var encryptedText = crypt.encrypt(text);    

    return encryptedText;
}

function guestLogin(){
    // guestId 가 있다면 로그인 요청
    // guestId 가 없다면 생성 요청
    if( guestId == undefined ){
        getGuestAccount();
    }else{
        loginGuestAccount();
    }
}

function login() {

    const id = getValueEncodedByPublicKey(loginId.value);
    const pwd = getValueEncodedByPublicKey(loginPassword.value);
    
    const req = {
        id: `${id}`,
        psword: `${pwd}`,
    };

    console.log( req );
    
    fetch("/user", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req)
    })
    .then( (res) => res.json()) // json() promise
    .then( (res) => {
        console.log( res);
        if( res.success ){
            showMainView();
            getUserInfo();

        } else {
            processResponseFail( res.msg ); 
        }
    })
};

function getGuestAccount()
{
    console.log("getGuestAccount");

    fetch("/user/guest", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify()
    })
    .then( (res) => res.json()) // json() promise
    .then( (res) => {
        console.log( res);
        if( res.success ){
            guestId = res.guestId;
            loginGuestAccount();
        } else {
            processResponseFail( res.msg );
        }
    })
}

function googleLogin(){


    //window.open("http://localhost:3000/auth/google",  "_self")    
    fetch("/auth/google")
    .then( (res) => res.json()) // json() promise
    .then( (res) => {
        //console.log( res);
        if( res.success ){
            console.log("google login success");
            window.open( res.url, "_self" );
        } else {
            processResponseFail( res.msg );
        }
    })
}

function loginGuestAccount(){
    console.log("loginGuestAccount");
    console.log( guestId );

    fetch("/user/guest", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( { guestId : `${guestId}` } )
    })
    .then( (res) => res.json()) // json() promise
    .then( (res) => {
        //console.log( res);
        if( res.success ){
            showMainView();
            getUserInfo();
        } else {
            processResponseFail( res.msg );
        }
    })
}


function registerAccount(){
    if( !registerId.value ) return alert("아이디를 입력해주세요");
    if( registerPsword.value !== registerPswordConfirm.value ){
        return alert("패스워드가 다릅니다");
    }
   
    // pswordConfirm: pswordConfirm.value,

    const req = {
        id: registerId.value,
        name: registerName.value,
        psword: registerPsword.value,
        
    };

   console.log( req );

    fetch("/user", {
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
            //location.href = "/";
            showLoginView();
        } else {
            processResponseFail( res.msg ); //=> cathc 발생
          //  location.href = "/login"
        }
    })
}

// "use strict"

// const id = document.querySelector("#id");
// const psword = document.querySelector("#psword");
// const loginBtn = document.querySelector("#button");

// loginBtn.addEventListener("click", login );

// function login() {

//     const req = {
//         id: id.value,
//         psword: psword.value,
//     };

//     fetch("/login", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(req)
//     })
//     .then( (res) => res.json()) // json() promise
//     .then( (res) => {
//         console.log( res);
//         if( res.success ){
//             location.href = "/"; 
//         } else {
//           alert( res.msg ); 
//             location.href = "/login"
//         }
//     })
// };