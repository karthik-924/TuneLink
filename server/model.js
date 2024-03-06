const mongoose = require("mongoose");

const url = process.env.MONGODB_URL;

mongoose.connect(url);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "default.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const postSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  authorName: {
    type: String,
    required: true,
  },
  songname: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  musicURL: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

module.exports = {User, Post};
