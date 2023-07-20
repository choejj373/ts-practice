import { processResponseFail } from './home.js'

const buyWeaponBtn = document.getElementById("buyWeapon");
const buyNecklaceBtn = document.getElementById("buyNecklace");
const buyGloveBtn = document.getElementById("buyGlove");
const buyArmorBtn = document.getElementById("buyArmor");
const buyBeltBtn = document.getElementById("buyBelt");
const buyShoesBtn = document.getElementById("buyShoes");
const freeGetBtn = document.getElementById("freeGetBtn");

buyWeaponBtn.addEventListener("click", ()=>buyItem(1) );
buyNecklaceBtn.addEventListener("click", ()=>buyItem(2) );
buyGloveBtn.addEventListener("click", ()=>buyItem(3) );
buyArmorBtn.addEventListener("click", ()=>buyItem(4) );
buyBeltBtn.addEventListener("click", ()=>buyItem(5) );
buyShoesBtn.addEventListener("click", ()=>buyItem(6) );
freeGetBtn.addEventListener("click", getFreeDiamond );

//하단 버튼(상점) 클릭시 매번 호출되어 진다.
export function getUserStoreInfo(){
    fetch("/store" )// GetUserStoreInfo
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            freeGetBtn.disabled = false;

            res.tradeList.forEach((trade)=>{
                if( trade.type == 1 ){
                    freeGetBtn.disabled = true;
                }
            });
        } else {
            processResponseFail( res.msg )

        }
    })
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