import { processResponseFail } from './home.js'
let mailMap = new Map();
let selectedMailId = 0;
let mailItemArray = [];

const showMailListBtn = document.getElementById("showMailListBtn");
showMailListBtn.addEventListener("click", showMailList );

const writeMailBtn = document.getElementById("writeMailBtn");
writeMailBtn.addEventListener("click", showMailWrite );


const sendMailBtn = document.getElementById("sendMailBtn");
sendMailBtn.addEventListener("click", sendMail );

const deleteMailBtn = document.getElementById("deleteMailBtn");
const getAttachedItemAllBtn  = document.getElementById("getAllAttachedItemBtn");

deleteMailBtn.addEventListener("click", deleteMail );
getAttachedItemAllBtn.addEventListener("click", getAttachedItemAll );

function sendMail(){
    const mail_receiver_user_name = document.getElementById("mail_receiver_user_name");
    const mail_title = document.getElementById("mail_title");
    const mail_msg = document.getElementById("mail_msg");
    const mail_gold = document.getElementById("mail_gold");

    console.log( mail_receiver_user_name.value );
    fetch("/mail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            receiver_user_name:mail_receiver_user_name.value,
            title:mail_title.value,
            msg:mail_msg.value,
            gold:parseInt(mail_gold.value)
        })
    })
    .then( (res) => res.json()) // json() promise
    .then( (res) => {
        console.log( res);
        if( res.success ){
            //selectedMailId = 0;
            // mailMap.get( parseInt(res.mailId) ).checked = 1;
            // console.log( mailMap );
        } else {
            processResponseFail( res.msg ); 
        }
    })            
}

function deleteMail(){
    console.log( selectedMailId );

    fetch("/mail", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({mailId:selectedMailId})
    })
    .then( (res) => res.json()) // json() promise
    .then( (res) => {
        console.log( res);
        if( res.success ){
            selectedMailId = 0;
            // mailMap.get( parseInt(res.mailId) ).checked = 1;
            // console.log( mailMap );
        } else {
            processResponseFail( res.msg ); 
        }
    })        
}

function getAttachedItemAll(){
    fetch("/mail/item/detachAll", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({mailId:selectedMailId})
    })
    .then( (res) => res.json()) // json() promise
    .then( (res) => {
        console.log( res);
        if( res.success ){
            // mailMap.get( parseInt(res.mailId) ).checked = 1;
            // console.log( mailMap );
        } else {
            processResponseFail( res.msg ); 
        }
    })            
}

function onClickedMailListItem(element)
{
    let str = element.target.innerText;
    const pos = str.indexOf(':');
    const id  = str.substring(0, pos );
    console.log( id );

    const mailTitle = document.getElementById('mailTitle');
    const mailMsg = document.getElementById('mailMsg');
    const mailGold = document.getElementById('mailGold');

    const mail = mailMap.get( parseInt(id) );

    console.log( mailMap );
    console.log( mail );

    if( mail ){
        console.log( mail.title );

        selectedMailId = mail.id;
        mailTitle.value = mail.title;
        mailMsg.value = mail.msg;
        mailGold.value = mail.gold;

        const mailItemList = document.getElementById("mailItemList");
        mailItemList.replaceChildren();

        mailItemArray.forEach((item)=>{
            if( item.mail_id === mail.id ){
                let messageItem = document.createElement('li');
                messageItem.textContent = item.id +":" +item.item_index;
                mailItemList.appendChild(messageItem);
            }
        })


        if( mail.checked === 0)
        {
            sendReadMail( mail.id );
        }
    }else{
        mailTitle.innerText = "";
        mailMsg.innerText = "";
    }
}
function sendReadMail( mailId )
{
    fetch("/mail", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({mailId})
    })
    .then( (res) => res.json()) // json() promise
    .then( (res) => {
        console.log( res);
        if( res.success ){
            mailMap.get( parseInt(res.mailId) ).checked = 1;
            console.log( mailMap );
        } else {
            processResponseFail( res.msg ); 
        }
    })    
}
function showMailWrite(){
    const mailWriteView = document.getElementById("mailWriteView");
    const mailReadView = document.getElementById("mailReadView");

    mailWriteView.style.display = "";
    mailReadView.style.display = "none";
}
function showMailList(){

    const mailWriteView = document.getElementById("mailWriteView");
    const mailReadView = document.getElementById("mailReadView");

    mailWriteView.style.display = "none";
    mailReadView.style.display = "flex";

    fetch("/mail" )
    .then((res) => res.json())
    .then((res) => {
        console.log( res );
        if( res.success ){
            const mailList = document.getElementById('mailList');

            mailList.replaceChildren();
            res.mails.forEach(element => {
                
                mailMap.set( element.id, element );

                let messageItem = document.createElement('li');
                messageItem.textContent = element.id +":" +element.title;

                messageItem.addEventListener("click", function(messageItem){
                    onClickedMailListItem(messageItem)} );

                mailList.appendChild(messageItem);
            });

            mailItemArray = res.items;
        }
        else{
            processResponseFail( res.msg )
        }
    })
}