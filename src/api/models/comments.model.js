const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentsSchema = new Schema(
  {
    text: { type: String, required: true, trim: true },
    author: { type: mongoose.Types.ObjectId, ref: "users", required: true },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("comments", commentsSchema);

module.exports = Comment;
