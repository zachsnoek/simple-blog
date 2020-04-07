const mongoose = require("mongoose");
const df = require("../utils/date");

const postSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    authorEmail: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: true
    },
    comments: {
        type: [String],
        required: false
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

const Post = mongoose.model("Post", postSchema);

module.exports = Post;