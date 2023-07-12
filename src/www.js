
"use strict";

const app  = require("../app");
// const sessionMiddleware = require("../app").sessionMiddleware;

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () =>{
    console.log("서버 가동 : ", PORT);
});

/**=========================================================== */
const SocketIO = require("socket.io");
const ioForClient = SocketIO( server, {path: "/socket.io"});

/**=========================================================== */
// 매치 메이킹 서버로의 접속
const ioConnector = require("socket.io-client");
const socketConnector = ioConnector.connect( process.env.MATCHMAKINGSVR_URL);

socketConnector.on('connection',()=>{
    console.log("match making server is connected");
});

socketConnector.on("matched",(data)=>{
     // 클라이언트에게 멀티플레이 서버로 이동
    const msg = JSON.parse( data )
    console.log( "matched : ", msg );
    ioForClient.to(msg.socketId).emit("move","http://localhost:3002");
});

socketConnector.on("match-failed",(data)=>{
    console.log("match failed : " + data);
    const msg = JSON.parse( data )
    ioForClient.to(msg.socketId).emit("move","http://localhost:3000/");
})


/**=========================================================== */
// http session과 연동

/*const wrap = (middleware) => (socket,next) => middleware(socket.request, socket.request.res || {}, next);
ioForClient.use( wrap( sessionMiddleware));
ioForClient.use( (socket,next) =>{
    const session = socket.request.session;
    // console.log( session.userId );
    // 인증 안된 session이라면 여기서 접속 차단 가능하다.아니면 on connection에서도 가능
    next();
});*/

/**=========================================================== */
ioForClient.on("connection", function( socket ){
    console.log( socket.id, "is connected...");


    socket.userId = socket.request.session.user_id;

    socket.on("disconnect", (reason)=>{
        console.log( socket.id, "is disconnected : ", reason)
        console.log( socket.userId );
        // 매치 메이킹 서버로 취소 알림
    });

    socket.on("error", (err)=>{
        console.log( socket.id, "is error : ",err)
    });

    if( !socketConnector.connected ){
        console.warn("match making server is not running");
        socket.emit("move","http://localhost:3000/");
        return;
    }


    socket.on('match', function(data){
        console.log("match : ");
        let msg = { 
            userId:socket.request.session.user_id,
            socketId:socket.id
        };
        console.log( msg );
        socketConnector.emit('match', JSON.stringify(msg) );
    });
});   