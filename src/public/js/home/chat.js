"use strict"

var socket = io.connect("http://localhost:3000",{
    path: "/socket.io"
});

const sendBtn = document.querySelector("#send");
const msgLine = document.querySelector("#myChat");	
const chatBox = document.querySelector("#chatContent");

function send(){
    console.log( msgLine );
    console.log("Send : " + msgLine.value);
    socket.emit("msg", `${msgLine.value}`);
    msgLine.value = "";
};

sendBtn.addEventListener("click", send );

socket.on('msg', function (data) {
    console.log( "received msg: " + data );

    const messagesList = document.querySelector('#chatContent');
    const messageItem = document.createElement('li');

    messageItem.textContent = data;
    messagesList.appendChild(messageItem);		
});
