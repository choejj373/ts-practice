import { processResponseFail } from './home.js'

function onClickBuyDailyStore( element ){
    console.log(element.target.getAttribute("id"));
    if( confirm ("구매하시겠습니까?") )
    {
        fetch("/store/daily", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify( {
                tradeId : parseInt( element.target.getAttribute("id") ),
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
}

function onClickBuyNormalStore( element ){
    console.log(element.target.getAttribute("id"));
    if( confirm ("구매하시겠습니까?") )
    {
        fetch("/store/normal", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify( {
                tradeId : parseInt( element.target.getAttribute("id") ),
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
}

function getNormalTradeList(){
    fetch("/store/normal" )
    .then((res) => res.json())
    .then((res) => {
        console.log( res );
        if( res.success ){
            const tradeTable = document.getElementById("normalStoreTradeTable");
            tradeTable.replaceChildren();

            let newRow = tradeTable.insertRow(-1);
            let newCell = newRow.insertCell(0);
            let newText = document.createTextNode("이름");
            newCell.appendChild(newText);            

            newCell = newRow.insertCell(1);
            newText = document.createTextNode("COUNT");
            newCell.appendChild(newText);               

            newCell = newRow.insertCell(2);
            newText = document.createTextNode("PRICE");
            newCell.appendChild(newText);
            
            newCell = newRow.insertCell(3);
            newText = document.createTextNode("");
            newCell.appendChild(newText);

            res.tradeItems.forEach((trade)=>{
                newRow = tradeTable.insertRow(-1);

                newCell = newRow.insertCell(0);
                newText = document.createTextNode( trade.name );
                newCell.appendChild(newText);            

                newCell = newRow.insertCell(1);
                newText = document.createTextNode( trade.count );
                newCell.appendChild(newText);            

                newCell = newRow.insertCell(2);
                newText = document.createTextNode( trade.price );
                newCell.appendChild(newText);            

                newCell = newRow.insertCell(3);
                let newButton = document.createElement("button");
                newButton.innerText = "구매";
                newButton.setAttribute( "id", trade.id );
                newButton.addEventListener("click", onClickBuyNormalStore );
                newCell.appendChild(newButton);                
            });
        } else {
            processResponseFail( res.msg )

        }
    })
}

function getDailyTradeList(){
    fetch("/store/daily" )
    .then((res) => res.json())
    .then((res) => {
        console.log( res );
        if( res.success ){
            const tradeTable = document.getElementById("dailyStoreTradeTable");
            tradeTable.replaceChildren();

            let newRow = tradeTable.insertRow(-1);
            let newCell = newRow.insertCell(0);
            let newText = document.createTextNode("이름");
            newCell.appendChild(newText);            

            newCell = newRow.insertCell(1);
            newText = document.createTextNode("COUNT");
            newCell.appendChild(newText);               

            newCell = newRow.insertCell(2);
            newText = document.createTextNode("PRICE");
            newCell.appendChild(newText);
            
            newCell = newRow.insertCell(3);
            newText = document.createTextNode("");
            newCell.appendChild(newText);

            res.tradeItems.forEach((trade)=>{
                newRow = tradeTable.insertRow(-1);

                newCell = newRow.insertCell(0);
                newText = document.createTextNode( trade.name );
                newCell.appendChild(newText);            

                newCell = newRow.insertCell(1);
                newText = document.createTextNode( trade.count );
                newCell.appendChild(newText);            

                newCell = newRow.insertCell(2);
                newText = document.createTextNode( trade.price );
                newCell.appendChild(newText);            

                newCell = newRow.insertCell(3);
                let newButton = document.createElement("button");
                newButton.innerText = "구매";
                newButton.setAttribute( "id", trade.id );
                newButton.addEventListener("click", onClickBuyDailyStore );
                newCell.appendChild(newButton);                
            });
        } else {
            processResponseFail( res.msg )

        }
    })
}

export function getTradeList()
{
    getNormalTradeList();
    getDailyTradeList();

   

}

function buyItem( type )
{
    console.log( "buyItem : ", type )

    fetch("/store/diamond", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {
            type : 1,        //무료 다이아
            itemType : type
        } )
    })
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){

        } else {
            alert( res.msg );
            processResponseFail( res.msg )
        }
    })
}


function getFreeDiamond(){

    fetch("/store/daily", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {
            type : 1,        //무료 다이아
        } )
    })
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            freeGetBtn.disabled = true;
        } else {
            alert( res.msg );
            processResponseFail( res.msg )
        }
    })
}