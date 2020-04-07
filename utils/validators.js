const User = require("../models/User");

// Custom validators for express-validator
module.exports = {

    // Check if a given email is registered
    userNotExists(email) {
        return User.findOne({email: email}).then(foundUser => {
            if (foundUser) {
                return Promise.reject("Email address is already in use.")
            }
        });
    },

    // Check if the password and confirmation password fields match
    confirmationPasswordsMatch(value, { req }) {
        if (value !== req.body.password) {
            throw new Error("Password and confirmation password must match.");
        }
        return true;
    }
}