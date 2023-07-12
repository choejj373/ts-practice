let socket = io.connect('http://localhost:3000',
{
    path: '/socket.io',
    // transports: ['websocket']
});

socket.on('error', (err)=>{
    console.log("error : ", err);
});

socket.on('connect',()=>{
    console.log("connected");
    socket.emit('match' );
});

socket.on("move", (data)=>{
    console.log( "move: " + data );
    window.location.href = data;    
})