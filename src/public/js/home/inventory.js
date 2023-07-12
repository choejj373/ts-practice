


const sendBtn = document.querySelector("#send");
const itemUid = document.querySelector("#item_uid");	

sendBtn.addEventListener("click", send );

function send(){
    const req = {
        item_uid: itemUid.value,        
    };

    fetch("/inventory/sell-item", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( req )
    })
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            window.location.reload();
        } else {
            alert( res.msg );
        }
    })

    // console.log( msgLine );
    // console.log("Send : " + msgLine.value);
    // socket.emit("msg", `${msgLine.value}`);
    // msgLine.value = "";
};


window.onload = function(){
    console.log("window onload");
    fetch("/inventory/get-all", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {} )
    })
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            const messagesList = document.querySelector('#inventory');

            res.items.forEach(element => {
                let messageItem = document.createElement('li');
                messageItem.textContent = `UID: ${element.item_uid}, INDEX: ${element.item_index}, OWNER: ${element.owner}`;
                messagesList.appendChild(messageItem);		
            });
        } else {
            alert( res.msg );
        }
    })
};