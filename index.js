const express = require('express');
const http_c = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const Server = require('socket.io');
const SimpleCat = require('./simpleCat.js')


const App = express();
const http = http_c.createServer(App);

const PORT = process.env.PORT || 5000;

const io = new Server(http);

App.use(bodyParser.json());
App.use(cors());

const userLogged = [];

const usersReadyPublic = [];
const allRooms = [];


App.post('/login' , (req, res) => {
    const nickname = req.body.nick;
    if(userLogged.length == 0){
        userLogged.push(nickname);
        res.send({uuid: 0});
    } else {
        let indexNickName = userLogged.findIndex(nick => nickname === nick);
        if(indexNickName !== -1){
            res.send({uuid: indexNickName});
        } else {
            userLogged.push(nickname);
            res.send({uuid: userLogged.length - 1});
        }
    }
    // res.send({uuid: -1});
});

App.get('/ranking', (req, res) => { 

});


App.get('/match', (req, res) => {

});

http.listen(PORT, () => {
    console.log(`Listenting on *:${PORT}`);
    console.log(SimpleCat)
});

const generateRandomString = () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
const createRoom = (f_socket, s_socket) => {
    return {
        f_player: f_socket,
        s_player: s_socket,
        matchRoom: generateRandomString(),
        status: 'wait',
        turn: f_socket.user,
        engine: new SimpleCat()
    }
};

io.on('connection', (socket) => {
    //indentify_yourself
    socket.on('auth', (data) => {
        // console.log(data);
        if( data.type === 'public' ){
            if(usersReadyPublic.length < 1){
                usersReadyPublic.push({ user: data.u_id, user_socket: socket});
                console.log(usersReadyPublic);
                socket.emit('status-update', {'wait': false, 'message': 'Esperando partida', 'matchRoom': "Sin sala asignada"})
            } else {
                // Creamos una room
                let f_user = usersReadyPublic.shift();
                let s_user = { user: data.u_id, user_socket: socket};
                let room = createRoom(f_user, s_user);
                allRooms[room.matchRoom] = room;
                f_user.user_socket.emit('new-match', {'wait': false, 'matchRoom': room.matchRoom, 'message': 'Es tu turno'});
                s_user.user_socket.emit('new-match', {'wait': true, 'matchRoom': room.matchRoom, 'message': 'Es su turno'});
            }
        }
    });
    socket.on('turn-player', (turnPlayer) => {
        //console.log(turnPlayer);
        //console.log(allRooms);
        let currentRoom = allRooms[turnPlayer.room];
        const {col, row} = turnPlayer;
        const engine = {currentRoom};
        //console.log(currentRoom);
        let sendingPlayer = turnPlayer.player;
        if(sendingPlayer == currentRoom.turn){

            let isFirstPlayerTurn = currentRoom.f_player.user == sendingPlayer;
            
            if(isFirstPlayerTurn){
                engine.firstPlayerTurn(col, row);
            } else {
                engine.secondPlayerTurn(col, row);
            }

            currentRoom.f_player.user_socket.emit("play-move", { col: turnPlayer.col, row: turnPlayer.row});
            currentRoom.s_player.user_socket.emit("play-move", { col: turnPlayer.col, row: turnPlayer.row});
            

            if( isFirstPlayerTurn ){
                console.log("Turno X");
                currentRoom.turn = currentRoom.s_player.user;
                currentRoom.s_player.user_socket.emit("unlock", {'wait': false,  'message': 'Es tu turno'});
                currentRoom.f_player.user_socket.emit("unlock",  {'wait': true,  'message': 'Es su turno'});
            
            } else {
                console.log("Turno Y");
                currentRoom.turn = currentRoom.f_player.user;
                currentRoom.f_player.user_socket.emit("unlock", {'wait': false,  'message': 'Es tu turno'});
                currentRoom.s_player.user_socket.emit("unlock", {'wait': true,  'message': 'Es su turno'});

            }
        }
    });
    

});