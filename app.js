const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const parseurl = require("parseurl");
require("dotenv").config();

const app = express();

// Passport configuration
require("./config/passport")(passport);

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

// EJS middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// Express session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

// Custom middleware to track the previous page visited
// Used to redirect the user after they log in
app.use((req, _, next) => {
    const ignorePaths = ["/blog/user/logout", "/favicon.ico"];
    const path = parseurl(req).pathname;
    
    if (req.method === "GET" && !ignorePaths.includes(path)) {
        if (!req.session.pages) {
            req.session.pages = {
                prev: "",
                cur: path
            };
        } else {
            req.session.pages.prev = req.session.pages.cur;
            req.session.pages.cur = path
        }
    }

    next();
});

// Routes
app.use("/blog", require(__dirname + "/routes/blog"));
app.use("/blog/user", require(__dirname + "/routes/user"));
app.use("/blog/posts", require(__dirname + "/routes/posts"));
app.use("/blog/admin", require(__dirname + "/routes/admin"));

app.get("/", (_, res) => {
    res.redirect("/blog")
});

app.get("*", (_, res) => {
    res.render("404");
});

// Run server
const PORT = process.env.port || 3000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));