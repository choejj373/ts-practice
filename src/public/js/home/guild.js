import { processResponseFail } from './home.js'


const createGuildBtn        = document.getElementById("createGuildBtn");
const deleteGuildBtn        = document.getElementById("deleteGuildBtn");

const showGuildAllListBtn   = document.getElementById("showGuildAllListBtn");
const showGuildInfoBtn      = document.getElementById("showGuildInfoBtn");
const deportGuildMemberBtn  = document.getElementById("deportGuildMemberBtn");
const inviteGuildMemberBtn  = document.getElementById("inviteGuildMemberBtn");
const requestGuildMemberBtn = document.getElementById("requestGuildMemberBtn");
// const showGuildListBtn = document.getElementById("showGuildListBtn");
const showGuildMemberBtn    = document.getElementById("showGuildMemberBtn");
const leaveGuildMemberBtn   = document.getElementById("leaveGuildMemberBtn");
const showGuildInviteListBtn = document.getElementById("showGuildInviteListBtn");
const showGuildRequestListBtn = document.getElementById("showGuildRequestListBtn");



createGuildBtn.addEventListener("click", createGuild );
deleteGuildBtn.addEventListener("click", deleteGuild );
showGuildAllListBtn.addEventListener("click", showGuildAllList );
showGuildInfoBtn.addEventListener("click", showMyGuildInfo );
showGuildMemberBtn.addEventListener("click", showGuildMember );

deportGuildMemberBtn.addEventListener("click", deportGuildMember );
inviteGuildMemberBtn.addEventListener("click",inviteGuildMember);
requestGuildMemberBtn.addEventListener("click",requestGuildMember );
// showGuildListBtn.addEventListener("click", showGuildList );

leaveGuildMemberBtn.addEventListener("click", leaveGuildMember );
showGuildInviteListBtn.addEventListener("click", showGuildInviteList );
showGuildRequestListBtn.addEventListener("click", showGuildRequestList );

function onClickedInviteItem(element){
    let url;
    if(confirm("승낙 하시겠습니까? 취소시 거절 됩니다.")){
        url = '/guild/invite/accept';
    }else{
        url = '/guild/invite/refuse';
    }

    console.log( element.target.innerText );
    let str = element.target.innerText;
    const pos = str.indexOf(':');
    console.log( pos );
    const id = str.substring(0, pos );
    console.log( id );

    fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {
            inviteId : parseInt( id )
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

function onClickedRequestItem(element){
    let url;
    if(confirm("승낙 하시겠습니까? 취소시 거절 됩니다.")){
        url = '/guild/request/accept';
    }else{
        url = '/guild/request/refuse';
    }


    let str = element.target.innerText;
    const pos = str.indexOf(':');
    const id = str.substring(0, pos );
    console.log( id );

    fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {
            requestId : parseInt( id )
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
// <!-- prompt user name -->
function inviteGuildMember()
{
    let userName = prompt("유저 이름을 입력해주세요")

    fetch('/guild/invite', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {
            name : userName     
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
function showGuildInviteList()
{
    fetch('/guild/invite')
    .then((res) => res.json()) 
    .then((res) => {
        console.log( res );
        if( res.success ){
            const guildInfoList = document.getElementById("guildInfoList");
            guildInfoList.replaceChildren()

            res.invites.forEach(element => {
                let messageItem = document.createElement('li');
                messageItem.textContent = element.id + ":"+element.name;
                messageItem.addEventListener("click", function(messageItem){
                    onClickedInviteItem(messageItem)} );
                guildInfoList.appendChild(messageItem);
            });

        } else {
            processResponseFail( res.msg )
        }
    })       
}


function showGuildRequestList(){
    fetch('/guild/request')
    .then((res) => res.json()) 
    .then((res) => {
        console.log( res );
        if( res.success ){
            const guildInfoList = document.getElementById("guildInfoList");
            guildInfoList.replaceChildren()

            res.requests.forEach(element => {
                let messageItem = document.createElement('li');
                messageItem.textContent = element.id +":"+element.name;
                messageItem.addEventListener("click", function(messageItem){
                    onClickedRequestItem(messageItem)} );
                guildInfoList.appendChild(messageItem);
            });

        } else {
            processResponseFail( res.msg )
        }
    })    
}


function requestGuildMember(){
    let guildName = prompt("길드 이름을 입력해주세요")

    fetch('/guild/request', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {
            name : guildName     
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
function leaveGuildMember(){
    fetch('/guild/member/self', {
        method: "DELETE",
        // headers: {
        //     "Content-Type": "application/json",
        // },
        // body: JSON.stringify( {} )
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

// <!-- prompt user name -->
function deportGuildMember(){

    let memberId = prompt("길드원 memberId를 입력해주세요")

    fetch('/guild/member', {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {
            name : parseInt( memberId )     
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


function showGuildMember(){
    fetch('/guild/member')
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            const guildInfoList = document.getElementById("guildInfoList");
            guildInfoList.replaceChildren()

            res.members.forEach(element => {
                let messageItem = document.createElement('li');
                messageItem.textContent = element.id + ":" + element.name;
                guildInfoList.appendChild(messageItem);
            });

        } else {
            processResponseFail( res.msg )
        }
    })    
}

function showGuildAllList(){
    fetch('/guild/all')
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            const guildInfoList = document.getElementById("guildInfoList");
            guildInfoList.replaceChildren()

            res.guilds.forEach(element => {
                let messageItem = document.createElement('li');
                messageItem.textContent = element.name;
                guildInfoList.appendChild(messageItem);
            });

        } else {
            processResponseFail( res.msg )
        }
    })    
}
// <!-- 내 길드 정보 -->
function showMyGuildInfo(){
    fetch('/guild/mine')
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            const guildInfoList = document.getElementById("guildInfoList");
            guildInfoList.replaceChildren()

            let messageItem = document.createElement('li');
            messageItem.textContent = res.id + ":" + res.name;
            guildInfoList.appendChild(messageItem);

        } else {
            processResponseFail( res.msg )
        }
    })    
}




function createGuild(){
    let name = prompt("길드 이름을 입력해주세요")
    fetch('/guild', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {
            name : name,       
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

function deleteGuild(){

    const guildId = prompt("길드 id를 입력해주세요");

    fetch('/guild', {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {
            guildId : parseInt( guildId )
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