const mongoose = require("mongoose");
const assert = require("assert");
const User = require("../src/user");
const Comment = require("../src/comment");
const BlogPost = require("../src/blogPost");

describe("Associations", () => {
  let joe;
  let blogPost;
  let comment;
  beforeEach(done => {
    joe = new User({ name: "Joe" });
    blogPost = new BlogPost({
      title: "JS is Great",
      content: "Yep, it really is."
    });
    comment = new Comment({ content: "Great post!" });

    // There is some mongoose magic happening here.
    // We're pushing the blogPost model we made above into joe.blogPost
    // Mongoose is recognizing that we're trying to make an association and because of the
    // type: Schema.Types.ObjectId and the 'ref' we added to the config of blogPosts within the Userschema
    // Mongoose knows to associate these, and to create an entire model of a blogPost hosted in an array inside of joe.blogPost.
    joe.blogPosts.push(blogPost);
    // The same is happening here, except with the comment we made above.
    blogPost.comments.push(comment);
    // And then again mongoose magic is doing a .setter behind the scenes to set the value of comment.user we made above
    // To be the model of Joe that we created.
    comment.user = joe;

    // Promise.all allows us to pass in an array of async functions, and then add a .then statement which will resolve
    // after the last one comes back. Note: All of the functions in the array will begin sending in parallel, so it's fairly performant.
    Promise.all([joe.save(), blogPost.save(), comment.save()]).then(() =>
      done()
    );
  });

  it("saves a relation between a user and a blogpost", done => {
    User.findOne({ name: "Joe" })
      // .populate allows us to populate the blogPosts property that will be return
      // returned from this findOne with the associated blogPost objects that match the id's
      // in the blogPosts array on our User model. If we don't use .populate, then the array will just return a list of id's.
      // if we just pass in a string, it will just populate that one property, but we might have more associations.
      // We can populate multiple associations as soon in the next test.
      .populate("blogPosts")
      .then(user => {
        assert(user.blogPosts[0].title === "JS is Great");
        done();
      });
  });

  it("saves a full relation graph", done => {
    User.findOne({ name: "Joe" })
    // Here we can pass an object into .populate to populate all the nested associations.
    // Note that the first object takes in two properties:
    // path and populate, then the value of populate is a path and a model, the model refers to the model name
    // made at mongoose.connect. Then the third property inside our second populate is populate, where we
    // populate our third association, which is that each comment has a user associated with it.
      .populate({
        path: "blogPosts",
        populate: {
          path: "comments",
          model: "comment",
          populate: {
            path: "user",
            model: "user"
          }
        }
      })
      .then(user => {
        assert(user.name === "Joe");
        assert(user.blogPosts[0].title === "JS is Great");
        assert(user.blogPosts[0].comments[0].content === "Great post!");
        assert(user.blogPosts[0].comments[0].user.name === "Joe");
        done();
      });
  });
});
