const express = require("express");
const route = express.Router();
const verifyToken = require("../utils/verifyToken");
const Post = require("../models/post");


route.post("/create", verifyToken, async (req, res) => {

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
    if(err.code === 11000) {
      return res.status(400).json("Title already exists");
    }
    res.status(400).json(err.errmsg);
  }
});

module.exports = route;
