const mongoose = require("mongoose");
const db = require("../db/pool").app();

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  documentType: {
    type: String,
    required: true,
  },
  documentNumber: {
    type: String,
    required: true,
  },
  birthday: {
    type: Number,
    required: false,
  },
  fullName: {
    type: String,
    required: false,
  },
  qrCode: {
    type: String,
    required: false,
  },
  certificates: {
    type: [
      {
        idCertificate: Number,
        valid: Boolean,
        _id: false,
      },
    ],
    default: [],
    required: true,
  },
});

module.exports = db.model("STUDENT", studentSchema, "student");
