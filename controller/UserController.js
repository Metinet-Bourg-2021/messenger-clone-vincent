const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

async function authenticate(username, password) {
    try {
        let user = await User.findOne({username:username});
        if (user === null) {
            let hash = await bcrypt.hash(password, 5);
            const user = new User({
                username: username,
                password: hash
            });
            let savedUser = await user.save();
            const token = jwt.sign({userId: savedUser._id}, 'secret_key', {expiresIn: "1h"});
            return {code:"SUCCESS", data:{username:savedUser.username, token:token, picture_url:savedUser.picture_url}};
        } else {
            let valid = await bcrypt.compare(password, user.password);
            if (valid) {
                const token = jwt.sign({userId: user._id}, 'secret_key', {expiresIn: "1h"});
                return {code:"SUCCESS", data:{username:user.username, token:token, picture_url:user.picture_url}};
            } else {
                return {code:"NOT_AUTHENTICATED", data:{}};
            }
        }
    } catch (error) {
        console.log(error);
        return {code:"NOT_AUTHENTICATED", data:{}};
    }
}

async function getUsers(token) {
    try {
        const decodedToken = jwt.verify(token, 'secret_key');
        const userId = decodedToken.userId;
        let user = await User.findOne({_id:userId});
        if (user === null) {
            return {code:"NOT_FOUND_USER", data:{}};
        } else {
            let users = await User.find();
            return {code:"SUCCESS", data:{users}};
        }
    } catch (error) {
        console.log(error);
        return {code:"NOT_AUTHENTICATED", data:{}};
    }
}

module.exports = {authenticate: authenticate, getUsers: getUsers};