const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var resetCodeSchema = new mongoose.Schema({
    code: {
      type: String
    },
    expiresOn: {
      type: Date
    },
    phone: {
      type: String
    },
    userId: {
      type: String
    }
});

mongoose.model('ResetCode', resetCodeSchema);
