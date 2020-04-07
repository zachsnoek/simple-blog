module.exports.PostFromUsers = {
    from: "users",
    localField: "authorEmail",
    foreignField: "email",
    as: "authorInfo"
}

module.exports.PostFromComments = {
    from: "comments",
    localField: "comments",
    foreignField: "commentID",
    as: "userComments"
}

module.exports.CommentFromUsers = {
    from: "comments",
    localField: "email",
    foreignField: "email",
    as: "authorInfo"
}