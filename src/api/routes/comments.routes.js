const express = require("express");
const Comment = require("../models/comments.model");
const Post = require("../models/posts.model");
const router = express.Router();
const { isAuth, isAdmin } = require("../../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const allComments = await Comment.find();
    return res.status(200).json(allComments);
  } catch (error) {
    return res.status(500).json("Error al leer los comentarios");
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const commentToFind = await Comment.findById(id);
    return res.status(200).json(commentToFind);
  } catch (error) {
    return next(error);
  }
});

router.post("/create/:post", [isAuth], async (req, res) => {
  try {
    const userID = req.user._id.toString();
    const post = req.params.post;
    const postToFind = await Post.findById(post);
    const comment = req.body;
    comment.author = userID;
    const newComment = new Comment(comment);
    const created = await newComment.save();
    postToFind.comments.push(created._id.toString());
    const postModify = new Post(postToFind);
    postModify._id = post;
    await Post.findByIdAndUpdate(post, postModify);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json("Error al crear el comentario");
  }
});

router.delete("/delete/:id", [isAdmin], async (req, res, next) => {
  try {
    const id = req.params.id;
    const commentToDelete = await Comment.findByIdAndDelete(id);
    return res.status(200).json(`Se ha conseguido borrar el comentario ${commentToDelete}`);
  } catch (error) {
    return next(error);
  }
});

router.put("/edit/:id", [isAuth], async (req, res, next) => {
  try {
    const id = req.params.id;
    const comment = req.body;
    const commentModify = new Comment(comment);
    commentModify._id = id;
    const commentUpdated = await Comment.findByIdAndUpdate(id, commentModify);
    return res
      .status(200)
      .json({ mensaje: "Se ha conseguido editar el comentario", commentModificado: commentUpdated });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
