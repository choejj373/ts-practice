


// const sendBtn = document.querySelector("#send");
// const itemUid = document.querySelector("#item_uid");	

// sendBtn.addEventListener("click", send );

// function send(){
//     const req = {
//         item_uid: itemUid.value,        
//     };

//     fetch("/inventory/sell-item", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify( req )
//     })
//     .then((res) => res.json()) // json() promise
//     .then((res) => {
//         console.log( res );
//         if( res.success ){
//             window.location.reload();
//         } else {
//             alert( res.msg );
//         }
//     })

// };


// window.onload = function(){
//     console.log("window onload");
//     fetch("/inventory/get-all", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify( {} )
//     })
//     .then((res) => res.json()) // json() promise
//     .then((res) => {
//         console.log( res );
//         if( res.success ){
//             const messagesList = document.querySelector('#inventory');

//             res.items.forEach(element => {
//                 let messageItem = document.createElement('li');
//                 messageItem.textContent = `UID: ${element.item_uid}, INDEX: ${element.item_index}, OWNER: ${element.owner}`;
//                 messagesList.appendChild(messageItem);		
//             });
//         } else {
//             alert( res.msg );
//         }
//     })
// };



import { processResponseFail } from './home.js'

const sellItemBtn = document.getElementById('sellItemBtn');
sellItemBtn.addEventListener("click", promptInputItemId );

export function getInventoryInfo(){
    fetch("/equipment" )// GetUserStoreInfo
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            const inven = document.querySelector('#inventory');
            const equip = document.querySelector('#equip');

            inven.replaceChildren();
            equip.replaceChildren();

            res.items.forEach(element => {

                if( element.equip )
                {
                    let messageItem = document.createElement('li');
                    messageItem.textContent = `${element.id}`;

                    messageItem.addEventListener("click", function(messageItem){
                        onClickedEquip(messageItem)} );

                    equip.appendChild(messageItem);

                }
                else{
                    let messageItem = document.createElement('li');
                    messageItem.textContent = `${element.id}`;

                    messageItem.addEventListener("click", function(messageItem){
                        onClickedInven(messageItem)} );

                    inven.appendChild(messageItem);
                }
            });
        } else {
            alert( res.msg );
        }
    })
}

function promptInputItemId(){
    console.log( "promptInputItemId");
    const itemId = prompt("아이템 아이디를 입력해주세요");
    console.log( itemId );

    fetch("/equipment/inventory/", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {
            itemUid : parseInt( itemId ),       
        } )
    })
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            //showInven();
        } else {
            processResponseFail( res.msg )
        }
    })
}

function onClickedEquip( element ){
    console.log( "clicked : ", parseInt( element.target.innerText ));
    fetch("/equipment/equip", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {
            itemUid : parseInt( element.target.innerText ),       
        } )
    })
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            //showInven();
        } else {
            processResponseFail( res.msg )
        }
    })
}

function onClickedInven( element ){
    console.log( "clicked : ", parseInt( element.target.innerText ));
    fetch("/equipment/inventory", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {
            itemUid : parseInt( element.target.innerText ),       
        } )
    })
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            //showInven();
        } else {
            //alert( res.msg );
            processResponseFail( res.msg )
        }
    })
}