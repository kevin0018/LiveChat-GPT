// models/chatRoom.js
const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
    sender: {type: String, required: true},
    message: {type: String, required: true},
    room: {type: Number, ref: 'Room', required: true},
    timestamp: {type: Date, default: Date.now}
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
