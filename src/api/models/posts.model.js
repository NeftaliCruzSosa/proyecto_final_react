const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postsSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
    ingredients: [
      {
        name: { type: String, required: true, trim: true },
        quantity: { type: String, required: true, trim: true },
      },
    ],
    author: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    cookTime: { type: String },
    img: { type: String, required: true },
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "comments",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("posts", postsSchema);

module.exports = Post;