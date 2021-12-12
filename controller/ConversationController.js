const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

async function getOrCreateOneToOneConversation(token, username) {
    try {
        const decodedToken = jwt.verify(token, 'secret_key');
        const userId = decodedToken.userId;
        let user = await User.findOne({_id:userId});
        if (user === null) {
            return {code:"NOT_FOUND_USER", data:{}};
        } else {
            let conversationFind = await Conversation.find();
            let conversation = conversationFind.filter(conv => conv.type === "one_to_one" && conv.participants.indexOf(username) !== -1 && conv.participants.indexOf(user.username) !== -1);
            if (conversation.length === 0) {
                const conversation = new Conversation({
                    id: conversationFind.length,
                    type: "one_to_one",
                    participants: [user.username, username]
                });
                let savedConversation = await conversation.save();
                return {code:"SUCCESS", data:{savedConversation}};
            } else {
                conversation = conversation[0];
                return {code:"SUCCESS", data:{conversation}};
            }
        }
    } catch (error) {
        console.log(error);
        return {code:"NOT_FOUND_CONVERSATION", data:{}};
    }
}

async function createManyToManyConversation(token, usernames) {
    try {
        const decodedToken = jwt.verify(token, 'secret_key');
        const userId = decodedToken.userId;
        let user = await User.findOne({_id:userId});
        if (user === null) {
            return {code:"NOT_FOUND_USER", data:{}};
        } else {
            usernames.push(user.username);
            let conversationFind = await Conversation.find();
            const conversation = new Conversation({
                id: conversationFind.length,
                type: "many_to_many",
                participants: usernames
            });
            let savedConversation = await conversation.save();
            return {code:"SUCCESS", data:{savedConversation}};
        }
    } catch (error) {
        console.log(error);
        return {code:"NOT_FOUND_CONVERSATION", data:{}};
    }
}

async function getConversations(token) {
    try {
        const decodedToken = jwt.verify(token, 'secret_key');
        const userId = decodedToken.userId;
        let user = await User.findOne({_id:userId});
        if (user === null) {
            return {code:"NOT_FOUND_USER", data:{}};
        } else {
            let conversationFind = await Conversation.find();
            let conversations = conversationFind.filter(conv => conv.participants.indexOf(user.username) !== -1);
            return {code:"SUCCESS", data:{conversations}};
        }
    } catch (error) {
        console.log(error);
        return {code:"NOT_FOUND_CONVERSATION", data:{}};
    }
}

async function postMessage(token, conversation_id, content) {
    try {
        const decodedToken = jwt.verify(token, 'secret_key');
        const userId = decodedToken.userId;
        let user = await User.findOne({_id:userId});
        if (user === null) {
            return {code:"NOT_FOUND_USER", data:{}};
        } else {
            let conversationFind = await Conversation.find();
            let conversation = conversationFind.filter(conv => conv.id === conversation_id);
            const message = {
                id: conversation[0].messages.length,
                from: user.username,
                content: content
            };
            conversation[0].messages.push(message);
            return {code:"SUCCESS", data:{conversation}};
        }
    } catch (error) {
        console.log(error);
        return {code:"NOT_FOUND_CONVERSATION", data:{}};
    }
}

module.exports = {getOrCreateOneToOneConversation: getOrCreateOneToOneConversation, createManyToManyConversation: createManyToManyConversation, getConversations: getConversations, postMessage: postMessage};