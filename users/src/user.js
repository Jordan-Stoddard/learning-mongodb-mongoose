const mongoose = require('mongoose');
const PostSchema = require('./postSchema.js')
const Schema = mongoose.Schema;

// This defines the schema for an individual user
const UserSchema = new Schema({
  // We can set the value of any property in our Schema to be an object.
  // We then pass in properties to that object which helps give us functionality to that property.
  name: {
    type: String,
    // required property's value expects an array, first value being a boolean, second value being the message sent back
    // if this property is required, but isn't passed in when creating a new user.
    required: [true, 'Name is required.'],
    // Validate takes in a config object, that tells Mongo how to check if this object is valid, based on the validation criteria passed in.
    validate: {
      validator: (name) => name.length > 2,
      message: 'Name must be longer than 2 characters.'
    }
  },
  // This is how you define a subdocument inside an existing Schema.
  posts: [PostSchema],
  likes: Number,
  // blogPosts is a reference to another collection, not a definition of a subdocument.
  blogPosts: [{
    type: Schema.Types.ObjectId,
    ref: 'blogPost'
  }]
});

// .virtual creates a virtual property on every instance of a User.
// We define the name of the virtual property in the string.
// We then chain a .get method onto the .virtual method.
// This runs a .getter method in the background (see JS .getter method)
// .get will cause a function to run when you attempt to access this virtual property.
// So if I attempt to access joe.postCount it will return the value of the function passed into
// the .get method. In this case the length of the post array specified with 'this' instance of a User.
// We use the function declaration rather than the fat arrow so that 'this' will be bound to the local scope rather than the window scope. 
UserSchema.virtual('postCount').get(function() {
  return this.posts.length;
})

// This builds a table or "model" inside our MongodB with the name
// of 'user' and the schema defined above.
// We save the value of this table as the variable "User" and
// export it from this file.
const User = mongoose.model('user', UserSchema);

module.exports = User;