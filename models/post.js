const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  img:{type:Object, required: false},
  user: { type: String, required: true },
  description: { type: String, required: true },
  location:{type: String, required: true},
  coordinate:{type:Object, required: false},
  date: { type: Date, default: Date.now }
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
