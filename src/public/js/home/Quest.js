import { processResponseFail } from './home.js'

const questList = document.getElementById('questList');

const dailyQuestBtn = document.getElementById('dailyQuestBtn');
const weeklyQuestBtn = document.getElementById('weeklyQuestBtn');
const normalQuestBtn = document.getElementById('normalQuestBtn');

dailyQuestBtn.addEventListener("click", showDailyQuestList );
weeklyQuestBtn.addEventListener("click", showWeeklyQuestList );
normalQuestBtn.addEventListener("click", showNormalQuestList );


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
            processResponseFail( res.msg )
        }
    })
}

