const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    picture_url: {
        type: String,
        default: "https://www.logolynx.com/images/logolynx/4b/4beebce89d681837ba2f4105ce43afac.png"
    }
});

module.exports = mongoose.model('User', userSchema);