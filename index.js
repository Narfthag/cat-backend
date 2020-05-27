const express = require('express');
const http_c = require('http');
const bodyParser = require('body-parser');


const App = express();
const http = http_c.createServer(App);

App.use(bodyParser.json());

const userLogged = [];

App.post('/login' , (req, res) => {
    console.log(req.body);
    const nickName = req.body.nick;
    // if(userLogged.length == 0){
    //     userLogged.push(nickname);
    //     res.send({uuid: 0});
    // } else {
    //     indexNickName = userLogged.findIndex(nick => nickName === nick);
    //     if(indexNickName !== -1){
    //         res.send({uuid: indexNickName});
    //     } else {
    //         userLogged.push(nickname);
    //         res.send({uuid: userLogged - 1});
    //     }
    // }
});

App.get('/ranking', (req, res) =>{

});


App.get('/match', (req, res) => {

});