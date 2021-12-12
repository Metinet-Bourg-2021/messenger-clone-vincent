const mongoose = require('mongoose');
const MessageShema = require('./Message.js');

const conversationSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true,
        enum: ["one_to_one", "many_to_many"]
    },
    participants: {
        type: Array,
        required: true,
        minLength: 2
    },
    messages: {
        type: [MessageShema],
        default: [],
    },
    title: {
        type: String,
        default: null,
    },
    theme: {
        type: String,
        default: "BLUE",
    },
    updated_at: {
        type: Date,
        default: new Date(),
    },
    seen: {
        type: Object,
        default: {},
    },
    typing: {
        type: Object,
        default: {},
    }
}, { minimize: false });

module.exports = mongoose.model('Conversation', conversationSchema);