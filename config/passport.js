const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({
            usernameField: 'email'
        }, (email, password, done) => {

            // Check to see if the user's email is registered
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: "Email or password is incorrect."});
                    }

                    // If the user exists, match the password
                    bcrypt.compare(password, user.password, (err , isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: "Email or password is incorrect."});
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}