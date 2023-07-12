const startBtn = document.querySelector("#startgame");
const endBtn = document.querySelector("#endgame");

window.onload = function(){
    document.getElementById("startgame").disabled = false;
    document.getElementById("endgame").disabled = true;
}

function startgame(){
    console.log( "start game" );

    fetch("/singlegame", {
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
            document.getElementById("startgame").disabled = true;
            document.getElementById("endgame").disabled = false;
        } else {
            alert( res.msg );
        }
    })
};

function endgame(){
    console.log( "end game" );

    fetch("/singlegame", {
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
            document.getElementById("startgame").disabled = false;
            document.getElementById("endgame").disabled = true;
        } else {
            alert( res.msg );
        }
    })


};

startBtn.addEventListener("click", startgame );
endBtn.addEventListener("click", endgame );
