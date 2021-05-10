const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  url: {
    type: String,
  },
  title: {
    type: String,
  },
  excerpt: {
    type: String,
  },
  lead_image_url: {
    type: String,
  },
  content: {
    type: String,
  },
  author: {
    type: String,
  },
  domain: {
    type: String,
  },
  date_published: {
    type: Date,
  },
  word_count: {
    type: Number,
  },
  tags: [],
  tagids: [],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Article", ArticleSchema);
