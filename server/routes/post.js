const express = require("express");
const route = express.Router();
const verifyToken = require("../utils/verifyToken");
const Post = require("../models/post");


route.post("/create", verifyToken, async (req, res) => {
    console.log(req.user);
  if (!req.user.isAdmin) {
    return res.status(403).json("Not allowed");
  }
  if (!req.body.title && !req.body.content) {
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
  }
  catch(err) {
    res.status(500).json(err);
  }
});

module.exports = route;
