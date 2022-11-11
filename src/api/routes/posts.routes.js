const express = require("express");
const Post = require("../models/posts.model");
const User = require("../models/users.model");
const router = express.Router();
const { isAuth, isAdmin } = require("../../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const allPosts = await Post.find().populate("author").populate("comments");
    return res.status(200).json(allPosts);
  } catch (error) {
    return res.status(500).json("Error al leer los posts");
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const postToFind = await Post.findById(id);
    return res.status(200).json(postToFind);
  } catch (error) {
    return next(error);
  }
});

router.get("/getbyauthor/:author", async (req, res, next) => {
  try {
    const author = req.params.author;
    const authorID = await User.findOne({ username: author });
    const postToFind = await Post.find({ author: authorID });
    return res.status(200).json(postToFind);
  } catch (error) {
    return next(error);
  }
});

router.post("/create", [isAuth], async (req, res) => {
  try {
    const userID = req.user._id.toString();
    const post = req.body;
    post.author = userID;
    const newPost = new Post(post);
    console.log(newPost)
    const created = await newPost.save();
    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json("Error al crear el post");
  }
});

router.delete("/delete/:id", [isAdmin], async (req, res, next) => {
  try {
    const id = req.params.id;
    const postToDelete = await Post.findByIdAndDelete(id);
    return res.status(200).json(`Se ha conseguido borrar el post ${postToDelete}`);
  } catch (error) {
    return next(error);
  }
});

router.put("/edit/:id", [isAuth], async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = req.body;
    const postModify = new Post(post);
    postModify._id = id;
    const postUpdated = await Post.findByIdAndUpdate(id, postModify);
    return res.status(200).json({ mensaje: "Se ha conseguido editar el post", postModificado: postUpdated });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
