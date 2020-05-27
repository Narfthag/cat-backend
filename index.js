const express = require('express');
const http_c = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');




const App = express();
const http = http_c.createServer(App);
const io = require('socket.io')(http)

const PORT = 5000;

App.use(bodyParser.json());
App.use(cors());

const userLogged = [];

const usersReadyPublic = [];
const usersReadyPrivate = [];
const privateRooms = [];
const publicRooms = [];




const generateRandomString = () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
const createRoom = (f_socket, s_socket) => {
    return {
        f_player: f_socket,
        s_player: s_socket,
        matchRoom: generateRandomString(),
        status: 'wait'
    }
};



App.post('/login' , (req, res) => {
    console.log(req.body);
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

App.get('/ranking', (req, res) =>{

});


App.get('/match', (req, res) => {

});

http.listen(PORT, () => {
    console.log(`Listenting on *:${PORT}`);
});

io.onconnection((socket) => {
    //indentify_yourself
    socket.on('auth', (data) => {
        console.log(data);
    })
});