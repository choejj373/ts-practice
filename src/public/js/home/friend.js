import { processResponseFail } from './home.js'


const requestFriendBtn = document.getElementById("requestFriendBtn");
requestFriendBtn.addEventListener("click", requestFriend );


const friendRequestBtn      = document.getElementById("friendRequestBtn");
const friendRequestedBtn    = document.getElementById("friendRequestedBtn");

friendRequestBtn.addEventListener("click", getFriendRequestList );
friendRequestedBtn.addEventListener("click", getFriendRequestedList );







function getFriendRequestList()
{
    fetch("/friend/request" )
    .then((res) => res.json())
    .then((res) => {
        console.log( res );
        if( res.success ){
            const requestList = document.getElementById('requestList');

            requestList.replaceChildren();

            res.requests.forEach(element => {
                let messageItem = document.createElement('li');
                messageItem.textContent = element.name;

                requestList.appendChild(messageItem);
            });
        }
        else{
            processResponseFail( res.msg )
        }
    })
}
function onClickedFriend( element ){

    if(!confirm("삭제 하시겠습니까?")){
        return;
    }

    fetch('/friend', {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {
            name : element.target.innerText,       
        } )
    })
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){

        } else {
            processResponseFail( res.msg )
        }
    })
}

function onClickedFriendRequested( element ){
    console.log( "clicked : ", parseInt( element.target.innerText ));

    let url;
    if(confirm("승낙 하시겠습니까??")){
        url = '/friend/requested/accept';
    }else{
        url = '/friend/requested/refuse';
    }
    fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {
            name : element.target.innerText,       
        } )
    })
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){

        } else {

            processResponseFail( res.msg )
        }
    })
}

function getFriendRequestedList()
{
    fetch("/friend/requested" )
    .then((res) => res.json())
    .then((res) => {
        console.log( res );
        if( res.success ){
            const requestList = document.getElementById('requestList');

            requestList.replaceChildren();

            res.requests.forEach(element => {
                let messageItem = document.createElement('li');
                messageItem.textContent = element.name;

                messageItem.addEventListener("click", function(messageItem){
                     onClickedFriendRequested(messageItem)} );


                requestList.appendChild(messageItem);
            });
        }
        else{
            processResponseFail( res.msg )
        }
    })
}

export function getFriendList()
{
    fetch("/friend" )
    .then((res) => res.json())
    .then((res) => {
        console.log( res );
        if( res.success ){
            const friendList = document.getElementById('friendList');

            friendList.replaceChildren();

            res.friends.forEach(element => {
                let messageItem = document.createElement('li');
                messageItem.textContent = element.friend_user_name;
                messageItem.addEventListener("click", function(messageItem){
                    onClickedFriend(messageItem)} );

                friendList.appendChild(messageItem);
            });
        }
        else{
            processResponseFail( res.msg )
        }
    })
}

function requestFriend()
{
    const nickname = prompt("유저 아이디를 입력해주세요");
    console.log( nickname );

    fetch("/friend/request", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {
            name : nickname,       
        } )
    })
    .then((res) => res.json()) 
    .then((res) => {
        console.log( res );
        if( res.success ){
            
        } else {
            processResponseFail( res.msg )
        }
    })
}