const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    from: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        default: "",
    },
    posted_at: {
        type: Date,
        default: new Date(),
    },
    delivered_to: {
        type: Object,
        default: {},
    },
    reply_to: {
        type: Object,
        default: {},
    },
    edited: {
        type: Boolean,
        default: false,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    reactions: {
        type: Object,
        default: {},
    }
}, { minimize: false });

module.exports = messageSchema;
