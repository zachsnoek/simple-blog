const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    forename: {
        type: String,
        required: true
    },
    surname: {
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
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: "user"
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;