const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// PostSchema is for document embedding or subdocuments, for nesting a Schema inside another Schema.

const PostSchema = new Schema({
  title: String
});

module.exports = PostSchema;