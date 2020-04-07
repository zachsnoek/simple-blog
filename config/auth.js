// Route protection functions
module.exports = {

    // Ensures that a user is logged in and an admin
    ensureAdmin: function(req, res, next) {
        if (req.isAuthenticated() && req.user.role === "admin") {
            return next();
        }
        req.flash("error_msg", "You do not have permission to view this resource.");
        res.redirect("/blog/user/login");
    },

    // Ensures that a user is logged in
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error_msg", "Please log in to view this resource.");
        res.redirect("/blog/user/login");
    },

    // Redirects a user to /blog if they are logged in
    // Used for routes that users do not need access to if logged in (e.g., login page)
    redirectIfAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect("/blog");
        } else {
            return next();
        }
    },

    // Redirects a user to /blog/user/login if they are not logged in
    redirectIfNotAuthenticated: function(req, res, next) {
        if (!req.isAuthenticated()) {
            req.flash("error_msg", "Please log in.");
            res.redirect("/blog/user/login");
        } else {
            return next();
        }
    }
}