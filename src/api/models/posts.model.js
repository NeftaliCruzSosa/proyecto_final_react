const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postsSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
    ingredients: [
      {
        name: { type: String, trim: true },
        quantity: { type: String, trim: true },
      },
    ],
    author: { type: mongoose.Types.ObjectId, ref: "users"},
    cookTime: { type: String },
    img: { type: String, required: true },
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "comments",
      },
    ],
    section: { type: String, required: true, enum: ["guiso", "ensalada", "postre", "cocktail", "otro"]}
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("posts", postsSchema);

module.exports = Post;
