//서버에서 발급받은 게스트 계정 저장
let guestId = undefined;



const loginView = document.getElementById("loginView");
const registerView = document.getElementById("registerView");
const mainView = document.getElementById("mainView");

const topView = document.getElementById("userInfo");
const bottomView = document.getElementById("navBottom");

const guestLoginBtn = document.getElementById("guestLoginBtn");
const moveRegisterBtn = document.getElementById("moveRegisterBtn");
const moveLoginBtn = document.getElementById("moveLoginBtn");


const registerBtn = document.getElementById("registerBtn");


const storeBtn = document.getElementById("store");
const invenBtn = document.getElementById("inven");
const combatBtn = document.getElementById("combat");
const challengeBtn = document.getElementById("challenge");
const evolutionBtn = document.getElementById("evolution");
const freeGetBtn = document.getElementById("freeGetBtn");

const buyWeaponBtn = document.getElementById("buyWeapon");
const buyNecklaceBtn = document.getElementById("buyNecklace");
const buyGloveBtn = document.getElementById("buyGlove");
const buyArmorBtn = document.getElementById("buyArmor");
const buyBeltBtn = document.getElementById("buyBelt");
const buyShoesBtn = document.getElementById("buyShoes");

const invenList = document.getElementById('inventory');
const sellItemBtn = document.getElementById('sellItemBtn');

const singlegameBtn =document.getElementById('singlegameBtn'); 
const questBtn = document.getElementById('quest');
const questView = document.getElementById('questView');
const combatView = document.getElementById('combatView');


const questList = document.getElementById('questList');

const dailyQuestBtn = document.getElementById('dailyQuestBtn');
const weeklyQuestBtn = document.getElementById('weeklyQuestBtn');
const normalQuestBtn = document.getElementById('normalQuestBtn');

const startGameBtn = document.getElementById('startGameBtn');
const endGameBtn = document.getElementById('endGameBtn');

const googleLoginBtn = document.getElementById('googleLoginBtn');


googleLoginBtn.addEventListener("click", googleLogin );

singlegameBtn.addEventListener("click", showSinglegameView );
startGameBtn.addEventListener("click", startGame );
endGameBtn.addEventListener("click", endGame );

moveRegisterBtn.addEventListener("click", showResisterView );
moveLoginBtn.addEventListener("click", showLoginView );

registerBtn.addEventListener("click", registerAccount );
guestLoginBtn.addEventListener("click", guestLogin );

questBtn.addEventListener("click", showQuestView );

dailyQuestBtn.addEventListener("click", showDailyQuestList );
weeklyQuestBtn.addEventListener("click", showWeeklyQuestList );
normalQuestBtn.addEventListener("click", showNormalQuestList );

sellItemBtn.addEventListener("click", promptInputItemId );
buyWeaponBtn.addEventListener("click", ()=>buyItem(1) );
buyNecklaceBtn.addEventListener("click", ()=>buyItem(2) );
buyGloveBtn.addEventListener("click", ()=>buyItem(3) );
buyArmorBtn.addEventListener("click", ()=>buyItem(4) );
buyBeltBtn.addEventListener("click", ()=>buyItem(5) );
buyShoesBtn.addEventListener("click", ()=>buyItem(6) );


storeBtn.addEventListener("click", showStore );
invenBtn.addEventListener("click", showInven );
combatBtn.addEventListener("click", showCombat );

evolutionBtn.addEventListener("click", clearMainView );
challengeBtn.addEventListener("click", clearMainView );

freeGetBtn.addEventListener("click", getFreeDiamond );


const registerId = document.getElementById("registerId");
const registerName = document.getElementById("registerName");
const registerPsword = document.getElementById("registerPsword");
const registerPswordConfirm = document.getElementById("registerPswordConfirm");

function guestLogin(){
    // guestId 가 있다면 로그인 요청
    // guestId 가 없다면 생성 요청
    if( guestId == undefined ){
        getGuestAccount();
    }else{
        loginGuestAccount();
    }
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
          alert( res.msg ); //=> cathc 발생
          //  location.href = "/login"
        }


    })
}

function showSinglegameView(){
    console.log('showQuestView');
    clearCombatRightView();

    combatView.style.display = '';
}

function showQuestView(){
    console.log('showQuestView');
    clearCombatRightView();
    questView.style.display = '';

    showDailyQuestList();
}

function showDailyQuestList(){
    console.log('showDailyQuestList');

    fetch("/quest/daily")
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            //오른쪽 화면에 표시하자.
            questList.replaceChildren();

            res.quests.forEach((element)=>{
                let item = document.createElement('li');
                item.textContent = `ID:${element.id}, QUESTIDX:${element.quest_index}, VALUE:${element.value}, Completed:${element.complete}, EXPIRED:${element.expire_date}`;
                
                item.addEventListener("click", function(item){
                    onClickedQuest(item)} );

                questList.appendChild( item);
            })

        } else {
            alert( res.msg );
            processResponseFail( res.msg )
        }
    })    
}
function showWeeklyQuestList(){
    console.log('showWeeklyQuestList');

    fetch("/quest/weekly")
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            //오른쪽 화면에 표시하자.
            questList.replaceChildren();

            res.quests.forEach((element)=>{
                let item = document.createElement('li');
                item.textContent = `ID:${element.id}, QUESTIDX:${element.quest_index}, VALUE:${element.value}, Completed:${element.complete}, EXPIRED:${element.expire_date}`;

                item.addEventListener("click", function(item){
                    onClickedQuest(item)} );
                
                questList.appendChild( item);
            })

        } else {
            alert( res.msg );
            processResponseFail( res.msg )
        }
    })    
    
}
function showNormalQuestList(){
    console.log('showNormalQuestList');
    fetch("/quest/normal")
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            //오른쪽 화면에 표시하자.
            questList.replaceChildren();

            res.quests.forEach((element)=>{
                let item = document.createElement('li');
                item.textContent = `ID:${element.id}, QUESTIDX:${element.quest_index}, VALUE:${element.value}, Completed:${element.complete}, EXPIRED:${element.expire_date}`;

                item.addEventListener("click", function(item){
                    onClickedQuest(item)} );
                
                questList.appendChild( item);
            })

        } else {
            alert( res.msg );
            processResponseFail( res.msg )
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
            showInven();
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
            showInven();
        } else {
            processResponseFail( res.msg )
        }
    })
}
function onClickedQuest( element){
    console.log( "clicked : ", element.target.innerText );

    const str = element.target.innerText;
    
    const posQuestId = str.indexOf(":") + 1;
    const endposQuestId = str.indexOf(",", posQuestId );
    const questId = str.substr( posQuestId, endposQuestId - posQuestId );
    console.log( questId );

    const posQuestIndex = str.indexOf(":", endposQuestId ) + 1;
    const endposQuestIndex = str.indexOf(",", posQuestIndex );
    const questIndex = str.substr( posQuestIndex, endposQuestIndex - posQuestIndex );
    console.log( questIndex );

    fetch("/quest/reward", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {
            questId : parseInt( questId ),       
            questIndex : parseInt( questIndex ) 
        } )
    })
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            // showInven();
        } else {
            alert( res.msg );
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
            showInven();
        } else {
            alert( res.msg );
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

function clearMainView()
{
    const mainDiv = document.getElementById("mainView");
    // TODO 모든 child list를 구해서 display = none으로;

    const mainStore = document.getElementById("mainStore");
    mainStore.style.display = 'none' ;

    const mainInven = document.getElementById("mainInven");
    mainInven.style.display = 'none' ;

    const mainCombat = document.getElementById("mainCombat");
    mainCombat.style.display = 'none' ;
}

function clearCombatRightView(){
    console.log("clearCombatRightView")
    combatView.style.display = 'none';
    questView.style.display = 'none';
}

function showCombat(){
    clearMainView();   
    const element = document.getElementById("mainCombat");
    element.style.display = '' ;

    clearCombatRightView();
    combatView.style.display = '';
 }

function showInven()
{
    clearMainView();   
 
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
                    messageItem.textContent = `${element.item_uid}`;

                    messageItem.addEventListener("click", function(messageItem){
                        onClickedEquip(messageItem)} );

                    equip.appendChild(messageItem);

                }
                else{
                    let messageItem = document.createElement('li');
                    messageItem.textContent = `${element.item_uid}`;

                    messageItem.addEventListener("click", function(messageItem){
                        onClickedInven(messageItem)} );

                    inven.appendChild(messageItem);
                }
            });
        } else {
            alert( res.msg );
        }
    })
 
    const element = document.getElementById("mainInven");
    element.style.display = '' ;
}

function showStore(){
    clearMainView();
    // 일일 무료 아이템
    // 골드로 사는 아이템
    // 다이아로 사는 아이템

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
            alert( res.msg );
            processResponseFail( res.msg )

        }
    })

    const element = document.getElementById("mainStore");
    element.style.display = '' ;

    // 무료 다이아를 얻지 않았다면 무료 구매 활성화 아니라면 비활성화
}

// User관련 Date를 가지고 있던 element들 초기화
function clearUserData()
{
    const inven = document.getElementById('inventory');
    const equip = document.getElementById('equip');

    inven.replaceChildren();
    equip.replaceChildren();


    questList.replaceChildren();
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

function showMainView(){
    loginView.style.display = 'none';
    registerView.style.display = 'none';
    mainView.style.display = '';
}

function showLoginView()
{
    mainView.style.display = 'none';
    registerView.style.display = 'none';
    loginView.style.display = '';    
}

function showResisterView()
{
    mainView.style.display = 'none';
    loginView.style.display = 'none';
    registerView.style.display = '';
}

function processResponseFail( msg )
{
    if( msg.indexOf('token') >= 0){
        showLoginView();
    }else{
        alert( msg )
    }
}

function getUserInfo()
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

const loginId = document.getElementById("loginId");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", login );

let g_publicKey = null;

// import JSEncrypt from "./JSEncrypt.min.js";

function getValueEncodedByPublicKey( text)
{

    var crypt = new JSEncrypt();

    // // 키 설정
    crypt.setPublicKey(g_publicKey);

    // // 암호화
    var encryptedText = crypt.encrypt(text);    

    return encryptedText;
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
          alert( res.msg ); 
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
          alert( res.msg );
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
          alert( res.msg );
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
          alert( res.msg );
        }
    })
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

let g_gameId = 0;
import { MakeNewGame, updateFrame, clearGame } from './game.js'

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