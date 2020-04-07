const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { Comment } = require("../models/Comment");
const _ = require("lodash");
const { ensureAdmin } = require("../config/auth");

//=========================
//          NEW
//=========================

router.get("/new", ensureAdmin, (req, res) => {
    res.render("new", {user: req.user});
});

router.post("/new", ensureAdmin, (req, res) => {
    const { title, description, content } = req.body;
    let errors = [];

    // Check that all fields are completed
    if (postVerified(title, description, content)) {
        // Kebab-case the post title
        const postID = _.kebabCase(req.body.title);

        // Create a new Post
        const post = new Post({
            id: postID,
            authorEmail: req.user.email,
            title: title,
            description: description,
            content: content
        });
        
        // Save the Post
        post.save((err) => {
            if (err) {
                errors = [{msg: "Error saving post."}];

                res.render("new", {
                    user: req.user,
                    title,
                    description,
                    content
                });
            } else {
                req.flash("success_msg", "Successfully saved new post.");
                res.redirect("/blog/posts/" + postID);
            }
        });
    } else {
        errors = [{msg: "Please complete all fields."}];

        res.render("new", {
            user: req.user,
            errors,
            title,
            description,
            content
        });
    }
});

//=========================
//          EDIT
//=========================

router.get("/edit/:postID", ensureAdmin, (req, res) => {
    // Check that given postID exists
    Post.findOne({id: req.params.postID}, (err, post) => {
        if (err) {
            req.flash("Error retrieving post for editing.");
            res.redirect("/blog/posts/" + postID);
        } else {
            res.render("editor", {
                user: req.user,
                postID: req.params.postID,
                title: post.title,
                description: post.description,
                content: post.content
            });
        }
    });
});

router.post("/edit/:postID", ensureAdmin, (req, res) => {
    const { title, description, content } = req.body;
    const postID = req.params.postID;

    // Check that all fields are completed
    if (postVerified(title, description, content)) {
        Post.findOneAndUpdate({id: postID}, {
            title,
            description,
            content
        }, (err) => {
            if (err) {
                req.flash("error_msg", "Could not update post.");
                res.redirect("/blog/admin/edit/" + postID);
            } else {
                req.flash("success_msg", "Successfully updated post.");
                res.redirect("/blog/posts/" + postID);
            }
        }, {
            useFindAndModify: false
        });
    } else {
        req.flash("error_msg", "Please complete all fields.");
        res.redirect("/blog/admin/edit/" + postID);
    }
});

//=========================
//          DELETE
//=========================

router.get("/delete/:postID", ensureAdmin, (req, res) => {
    const postID = req.params.postID;

    Post.findOneAndDelete({id: postID}, (err, post) => {
        if (err) {
            req.flash("error_msg", "Could not delete post.");
            res.redirect("/blog/posts/" + postID);
        } else {
            // Delete all of the Posts comments
            post.comments.forEach((comment) => {
                Comment.findOneAndDelete({commentID: comment}, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            });
            
            req.flash("success_msg", "Successfully deleted post.");
            res.redirect("/blog");
        }
    }, {
        useFindAndModify: false
    });
});

// Helper function to ensure that the title, description, and content
//  fields are completed
function postVerified(title, description, content) {
    return title && description && content;
}

module.exports = router;