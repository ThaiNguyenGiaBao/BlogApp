const express = require("express");
const route = express.Router();
const verifyToken = require("../utils/verifyToken");
const Post = require("../models/post");

route.post("/create", verifyToken, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json("Not allowed");
  }
  if (!req.body.title || !req.body.content) {
    return res.status(400).json("Please enter all the fields");
  }
  const slug = req.body.title.replace(/ /g, "-").toLowerCase();
  const newPost = new Post({
    userId: req.user.id,
    title: req.body.title,
    content: req.body.content,
    img: req.body.img,
    category: req.body.category,
    slug: slug,
  });
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json("Title already exists");
    }
    res.status(400).json(err.errmsg);
  }
});

route.get("/getposts", verifyToken, async (req, res) => {
  try {
    const startIdx = parseInt(req.query.startIdx) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.search && {
        $or: [
          { title: { $regex: req.query.search, $options: "i" } },
          { content: { $regex: req.query.search, $options: "i" } },
        ],
      }),
    })
      .sort({ updateAt: sortDirection })
      .skip(startIdx)
      .limit(limit);

    const totalPosts = await Post.countDocuments({});
    const totalPostsLastMonth = await Post.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      },
    });

    res.status(200).json({ posts, totalPosts, totalPostsLastMonth });
  } catch (err) {
    res.status(500).json(err);
  }
});

route.delete("/delete/:id", verifyToken, async (req, res) => {
  //console.log(req.user.isAdmin)
  if (!req.user.isAdmin) {
    return res.status(403).json("Not allowed to delete");
  }

  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json("Post deleted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

route.put("/update/:id", verifyToken, async (req, res) => {
  console.log(req.body);
  if (!req.user.isAdmin) {
    return res.status(403).json("Not allowed to update");
  }
  if (!req.body.title || !req.body.content) {
    return res.status(400).json("Please enter all the fields");
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = route;
