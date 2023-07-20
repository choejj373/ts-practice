import { getUserStoreInfo } from './store.js'
import { MakeNewGame, updateFrame, clearGame } from './game.js'
import { getFriendList} from "./friend.js"
import { getInventoryInfo } from "./inventory.js"

let g_gameId = 0;
export let g_publicKey = null;

const friendBtn = document.getElementById("friend");
const guildBtn = document.getElementById("guild");
const storeBtn = document.getElementById("store");
const invenBtn = document.getElementById("inven");
const combatBtn = document.getElementById("combat");
const questBtn = document.getElementById('quest');
const mailBtn = document.getElementById('mail');
const moveRegisterBtn = document.getElementById("moveRegisterBtn");
const moveLoginBtn = document.getElementById("moveLoginBtn");


friendBtn.addEventListener("click", showFriend );
guildBtn.addEventListener("click", showGuild );
storeBtn.addEventListener("click", showStore );
invenBtn.addEventListener("click", showInven );
combatBtn.addEventListener("click", showCombat );
questBtn.addEventListener("click", showQuest );
mailBtn.addEventListener("click", showMail);
moveRegisterBtn.addEventListener("click", showResisterView );
moveLoginBtn.addEventListener("click", showLoginView );




const loginView = document.getElementById("loginView");
const registerView = document.getElementById("registerView");
const mainView = document.getElementById("mainView");

// const topView = document.getElementById("userInfo");
// const bottomView = document.getElementById("navBottom");



// const invenList = document.getElementById('inventory');


// const combatView = document.getElementById('combatView');
// const questView = document.getElementById('questView');


// const singlegameBtn =document.getElementById('singlegameBtn'); 
const startGameBtn = document.getElementById('startGameBtn');
const endGameBtn = document.getElementById('endGameBtn');


// singlegameBtn.addEventListener("click", showSinglegameView );
startGameBtn.addEventListener("click", startGame );
endGameBtn.addEventListener("click", endGame );


const nameTxt = document.getElementById("name");
nameTxt.addEventListener("click", changeNickname );


export function showLoginView()
{
    mainView.style.display = 'none';
    registerView.style.display = 'none';
    loginView.style.display = '';    
}

export function processResponseFail( msg )
{
    if( msg.indexOf('token') > -1){
        showLoginView();
    }else{
        alert( msg )
    }
}

export function showMainView(){
    loginView.style.display = 'none';
    registerView.style.display = 'none';
    mainView.style.display = '';
}

export function getUserInfo()
{
    fetch("/user" )// get user info
     .then((res) => res.json()) // json() promise
     .then((res) => {
         console.log( res );
         if( res.success ){

             usernameTxt.value = res.userName;
             expTxt.value = res.exp;
             battlecoinTxt.value = res.battleCoin;
             diamondTxt.value = res.diamond;
             moneyTxt.value = res.userMoney;

         } else {
            processResponseFail( res.msg )
         }
     })
}
function getPublicKey()
{
    fetch("/crypto/publickey")
    .then( (res) => res.json()) // json() promise
    .then( (res) => {
        console.log( res);
        if( res.success ){
            g_publicKey = res.publicKey;
            checkToken();
        } else {
          alert( res.msg );
        }
    })
}

window.onload = function(){
    console.log( "window onload" );
    // showLoginView();
    getPublicKey();
};


function changeNickname()
{
    const nickname = prompt("변경할 닉네임을 입력해주세요");
    console.log( nickname );

    if( nickname === "")
        return;

    fetch("/user/nickname", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {
            nickname : nickname,       
        } )
    })
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            //TODO 화면상 닉네임을 변경해주자.
            usernameTxt.value = res.msg;
            
            console.log("change nickname is success")
            console.log(res.msg);
        } else {
            console.log("change nickname is fail")
            processResponseFail( res.msg )
        }
    })
}



// function showSinglegameView(){
//     console.log('showQuestView');
//     clearCombatRightView();

//     combatView.style.display = '';
// }



function clearMainView()
{
    // const mainDiv = document.getElementById("mainView");
    // TODO 모든 child list를 구해서 display = none으로;

    const mainStore = document.getElementById("mainStore");
    mainStore.style.display = 'none' ;

    const mainInven = document.getElementById("mainInven");
    mainInven.style.display = 'none' ;

    const mainCombat = document.getElementById("mainCombat");
    mainCombat.style.display = 'none' ;

    const mainFriend = document.getElementById("mainFriend");
    mainFriend.style.display = 'none' ;

    const mainGuild = document.getElementById("mainGuild");
    mainGuild.style.display = 'none' ;

    const mainMail = document.getElementById("mainMail");    
    mainMail.style.display = 'none' ;

    const mainQueset = document.getElementById("mainQuest");    
    mainQueset.style.display = 'none' ;
}


// function clearCombatRightView(){
//     console.log("clearCombatRightView")
//     combatView.style.display = 'none';
//     questView.style.display = 'none';
// }


function showCombat(){
    clearMainView();   
    const element = document.getElementById("mainCombat");
    element.style.display = '' ;

    // clearCombatRightView();
    // combatView.style.display = '';
 }

function showQuest(){
    clearMainView();   
    const element = document.getElementById("mainQuest");
    element.style.display = '' ;
}

function showMail(){
    clearMainView();   
    const element = document.getElementById("mainMail");
    element.style.display = '' ;
 }

function showInven()
{
    clearMainView();   
    const element = document.getElementById("mainInven");
    element.style.display = '' ;

    getInventoryInfo();
}

function showStore(){
    clearMainView();
    const element = document.getElementById("mainStore");
    element.style.display = '' ;

    getUserStoreInfo();

}
function showFriend(){
    clearMainView();   
    const element = document.getElementById("mainFriend");
    element.style.display = '' ;

    getFriendList();
}

function showGuild(){
    clearMainView();   
    const element = document.getElementById("mainGuild");
    element.style.display = '' ;

    //getFriendList();
}

// function showQuest(){
//     clearMainView();   
//     const element = document.getElementById("mainQuest");
//     element.style.display = '' ;

//     //getFriendList();
// }

// User관련 Date를 가지고 있던 element들 초기화
function clearUserData()
{
    document.getElementById('inventory').replaceChildren();
    document.getElementById('equip').replaceChildren();
    document.getElementById('questList').replaceChildren();
    document.getElementById('guildInfoList').replaceChildren();
    document.getElementById('mailInfoList').replaceChildren();

    document.getElementById('requestList').replaceChildren();
    document.getElementById('friendList').replaceChildren();
    document.getElementById('singlegameLog').replaceChildren();

}


function showResisterView()
{
    mainView.style.display = 'none';
    loginView.style.display = 'none';
    registerView.style.display = '';
}




function checkToken(){
    console.log("checkToken");

    fetch("/", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( )
    })
    .then( (res) => res.json()) // json() promise
    .then( (res) => {
        //console.log( res);
        if( res.success ){
            showMainView();
            getUserInfo();
        } else {
            processResponseFail( res.msg )
        }
    })
}
const usernameTxt = document.getElementById("name");
const expTxt = document.getElementById("exp");
const battlecoinTxt = document.getElementById("battlecoin");
const diamondTxt = document.getElementById("diamond");
const moneyTxt = document.getElementById("money");

// import Party from  "./Party.mjs";
// const p = new Party;





function endGame(){
    let messageItem = document.createElement('li');
    messageItem.textContent = "Game End";
    singlegameList.appendChild(messageItem);

    singlegameList.scrollTo( 0 , singlegameList.scrollHeight );

    endGameBtn.disabled = true; 
    startGameBtn.disabled = false; 
    clearInterval( g_gameId );
    clearGame();
}

const singlegameList = document.getElementById("singlegameLog");
function updateGameFrame(){

    if(!updateFrame(singlegameList)){
        endGame();
    }
}

function startGame()
{
    singlegameList.replaceChildren();

    let messageItem = document.createElement('li');
    messageItem.textContent = "Game Start";
    singlegameList.appendChild(messageItem);

    endGameBtn.disabled = false; 
    startGameBtn.disabled = true;

    MakeNewGame();

    g_gameId = setInterval( updateGameFrame, 30 );
}



const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", logout );


function logout(){
    console.log( "clicked" );
    fetch("/user", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {} )
    })
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            clearUserData();
            showLoginView();
        } else {
            alert( res.msg );
        }
    })
}