const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.get("/", (req, res) => {
    // Find all Posts and sort by date descending
    Post.find((err, results) => {
        if (err) {
            res.render("404");
        } else {
            res.render("blog", {
                user: req.user,
                posts: results
            });
        }
    }).sort({date: -1})
});

module.exports = router;