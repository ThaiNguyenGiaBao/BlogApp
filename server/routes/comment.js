const express = require("express");
const route = express.Router();
const verifyToken = require("../utils/verifyToken");
const Comment = require("../models/comment");
const User = require("../models/user");

route.post("/addcomment", verifyToken, async (req, res) => {
  const newComment = new Comment({
    userId: req.user.id,
    postId: req.body.postId,
    content: req.body.content,
  });
  try {
    const savedComment = await newComment.save();
    console.log("Save success");
    res.status(200).json(savedComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

route.get("/:postId", async (req, res) => {
  //console.log(req.params.postId);
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    console.log(comments.length);
    //console.log(comments);
    const commentsWithUser = await Promise.all(
      comments.map(async (comment) => {
        const user = await User.findById(comment.userId);
        if (user) {
            console.log(user._id)
          return {
            ...comment._doc,
            user: {
              username: user.username,
              avatar: user.avatar,
            },
          };
        }
        else{
            console.log("User not found");
        }
      })
    );

    // Filter out comments without user
    console.log(commentsWithUser.length);
    const filteredComments = commentsWithUser.filter((comment) => comment);

    res.status(200).json(filteredComments);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = route;
