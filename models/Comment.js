const mongoose = require("mongoose");
const df = require("../utils/date");

const commentSchema = new mongoose.Schema({
    commentID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    formattedDate: {
        type: String,
        default: df.formatMDY()
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports.commentSchema = commentSchema;
module.exports.Comment = Comment;