const mongoose = require('mongoose');
const db = require('../../db/pool').app();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = db.model("USER", userSchema, "user");