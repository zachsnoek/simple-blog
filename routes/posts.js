const express = require("express");
const router = express.Router();
const _ = require("lodash");
const showdown = require("showdown");
const converter = new showdown.Converter();
const Post = require("../models/Post");
const { Comment } = require("../models/Comment");
const joins = require("../utils/joins");

router.get("/:postID", (req, res) => {
    const postID = _.kebabCase(req.params.postID);

    // Get complete user and comment data
    Post.aggregate([
        {
            $lookup: joins.PostFromUsers
        },
        {
            $lookup: joins.PostFromComments
        }
    ]).then((agg) => {
        // From the aggregate, find the correct postID
        const post = agg.find(element => element.id === postID);

        res.render("post", {
            user: req.user,
            post: post,
            content: converter.makeHtml(post.content)
        });                
    }).catch((err) => {
        const errors = [{msg: "Error loading post."}];
        res.render("404", {errors: errors});
    });
});

router.post("/:postID/comment", (req, res) => {
    const { content } = req.body;
    const { postID } = req.params;

    // Check to make sure that the field is completed
    if (!content) {
        req.flash("error_msg", "Please complete the comment field before submitting.");
        res.redirect("/blog/posts/" + postID);
    } else {
        const email = req.user.email;
        const commentID = email + "-" + Date.now();
        
        // Create a new Comment
        const comment = new Comment({
            commentID: commentID,
            name: req.user.forename + " " + req.user.surname,
            content: content
        });

        // Save the Comment
        comment.save((err) => {
            if (err) {
                req.flash("error_msg", "Error saving comment.");
                res.redirect("/blog/posts/" + postID);
            }
        });

        // Find the post that it belongs to and add its commentID to 
        //  its comments field
        Post.findOne({id: postID}, (err, result) => {
            if (!err) {
                result.comments.push(commentID);
                result.save();
                res.redirect("/blog/posts/" + postID);
            } else {
                req.flash("error_msg", "Error saving comment.");
                res.redirect("/blog/posts/" + postID);
            }
        });
    }
});

module.exports = router;