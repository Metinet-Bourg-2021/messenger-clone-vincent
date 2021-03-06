require('dotenv/config');
const express = require("express");
const mongoose = require('mongoose');
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, { cors: { origin: "*" } });

app.get("/", (req, res) => {
    res.send("A utiliser pour du debug si vous avez besoin...");
});

server.listen(process.env.PORT, () => {
    console.log("Server is listening");
});

mongoose.connect(
    process.env.DB_ADDRESS,
    {useNewUrlParser : true , useUnifiedTopology: true})
    .then(() => console.log("Connected"))
    .catch(error => console.log(error));

const userController = require('./controller/UserController');
const conversationController = require('./controller/ConversationController');

io.on("connection", socket => {
    //Penser a conserver le socket pour pouvoir s'en servir plus tard
    //Remplacer les callbacks par des fonctions dans d'autres fichiers.

    //socket.on("@authenticate", ({username, password}, callback) => {callback({code:"SUCCESS", data:{}});});
    socket.on("@authenticate", async ({username, password}, callback) => {
        let returnToClient = await userController.authenticate(username, password);
        callback(returnToClient);
    });
    
    //socket.on("@getUsers", ({token}, callback) => {callback({code:"SUCCESS", data:{}});});
    socket.on("@getUsers", async ({token}, callback) => {
        let returnToClient = await userController.getUsers(token);
        callback(returnToClient);
    });

    //socket.on("@getOrCreateOneToOneConversation", ({token, username}, callback) => {callback({code:"SUCCESS", data:{}});});
    socket.on("@getOrCreateOneToOneConversation", async ({token, username}, callback) => {
        let returnToClient = await conversationController.getOrCreateOneToOneConversation(token, username);
        callback(returnToClient);
    });

    //socket.on("@createManyToManyConversation", ({token, usernames}, callback) => {callback({code:"SUCCESS", data:{}});});
    socket.on("@createManyToManyConversation", async ({token, usernames}, callback) => {
        let returnToClient = await conversationController.createManyToManyConversation(token, usernames);
        callback(returnToClient);
    });

    //socket.on("@getConversations", ({token}, callback) => {callback({code:"SUCCESS", data:{conversations:[]}});});
    socket.on("@getConversations", async ({token}, callback) => {
        let returnToClient = await conversationController.getConversations(token);
        callback(returnToClient);
    });
    
    //socket.on("@postMessage", ({token, conversation_id, content}, callback) => {callback({code:"SUCCESS", data:{}});});
    socket.on("@postMessage", async ({token, conversation_id, content}, callback) => {
        let returnToClient = await conversationController.postMessage(token, conversation_id, content);
        callback(returnToClient);
    });
    socket.on("@seeConversation", ({token, conversation_id, message_id}, callback) => {callback({code:"SUCCESS", data:{}});});
    socket.on("@replyMessage", ({token, conversation_id, message_id, content}, callback) => {callback({code:"SUCCESS", data:{}});});
    socket.on("@editMessage", ({token, conversation_id, message_id, content}, callback) => {callback({code:"SUCCESS", data:{}});});
    socket.on("@reactMessage", ({token, conversation_id, message_id, reaction}, callback) => {callback({code:"SUCCESS", data:{}});});
    socket.on("@deleteMessage", ({token, conversation_id, message_id, content}, callback) => {callback({code:"SUCCESS", data:{}});});

    socket.on("disconnect", (reason) =>{ });
});

// Addresse du serveur d??mo: wss://teach-vue-chat-server.glitch.me