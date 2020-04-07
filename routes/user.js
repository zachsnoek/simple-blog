const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const { confirmationPasswordsMatch, userNotExists }  = require("../utils/validators"); // Custom validators
const passport = require("passport");
const User = require("../models/User");
const { redirectIfAuthenticated, redirectIfNotAuthenticated } = require("../config/auth");

//=========================
//      REGISTRATION
//=========================

router.get("/register", redirectIfAuthenticated, (_, res) => {
    res.render("register");
});

router.post("/register", redirectIfAuthenticated, [
    check("forename")
        .isLength({ min: 1 }).withMessage("Please enter your first name.")
        .escape(),
    check("surname")
        .isLength({ min: 1}).withMessage("Please enter your last name.")
        .escape(),
    check("email")
        .isLength({ min: 1}).withMessage("Please enter your email.")
        .isEmail().withMessage("Email must be formatted correctly.")
        .custom(userNotExists)
        .normalizeEmail(),
    check("password")
        .isLength({ min: 5 }).withMessage("Password must be at least 5 characters long."),
    check("confirmpassword").custom(confirmationPasswordsMatch)
], (req, res) => {
    const { forename, surname, email, password, confirmpassword } = req.body;
    const errors = validationResult(req);

    // If any validation did not pass, re-render the form with the errors
    if (!errors.isEmpty()) {
        res.render("register", {
            errors: errors.array(),
            forename,
            surname,
            email,
            password,
            confirmpassword
        });
    }

    // Create a new User
    const newUser = new User({
        forename,
        surname,
        email,
        password
    });
                
    // Hash the password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            req.flash("error_msg", "Error registering user.");
            res.redirect("/blog/user/register");
        }

        newUser.password = hash;

        // Save the user
        newUser.save((err) => {
            if (err) {
                req.flash("error_msg", "Error registering user.");
                res.redirect("/blog/user/register");
            }

            req.flash(
                'success_msg',
                'You are now registered and can log in'
            );
            
            res.redirect('/blog/user/login');
        });
    });
});

//=========================
//          LOGIN
//=========================

router.get("/login", redirectIfAuthenticated, (_, res) => res.render("login"));

router.post("/login", redirectIfAuthenticated, (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: req.session.pages.prev,
        failureRedirect: "/blog/user/login",
        failureFlash: true
    })(req, res, next);
});

//=========================
//          LOGOUT
//=========================

router.get("/logout", redirectIfNotAuthenticated, (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out.");
    res.redirect("/blog/user/login");
});

//=========================
//          DELETE
//=========================

router.get("/delete", redirectIfNotAuthenticated, (req, res) => {
    User.findByIdAndDelete(req.user._id, (err) => {
        if (err) {
            req.flash("error_msg", "Could not delete account.");
            res.redirect(req.session.pages.prev);
        } else {
            req.flash("success_msg", "Successfully deleted account.");
            res.redirect("/blog");
        }
    });
});

module.exports = router;