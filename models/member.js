const mongoose = require('mongoose')
const db = require('../db/pool').app()

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['PRIVATE', 'PUBLIC', 'ENTITY'],
    required: true
  },
  abbreviation: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: false
  },
  certificatesNumberValid: {
    type: Number,
    default: 0,
    required: true
  },
  certificatesNumberAnnulled: {
    type: Number,
    default: 0,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  publicKey: {
    type: String,
    required: false,
    default: ''
  },
  role: {
    type: String,
    enum: ['ADMIN', 'MEMBER'],
    required: true
  }
})

module.exports = db.model("MEMBER", memberSchema, "member")