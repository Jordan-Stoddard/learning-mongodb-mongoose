const assert = require("assert");
const User = require("../src/user.js");

describe("Subdocument tests", () => {
  it("can create a subdocument", done => {
    const joe = new User({
      name: "Joe",
      posts: [{ title: "PostTitle" }]
    });

    joe
      .save()
      .then(() => User.findOne({ name: "Joe" }))
      .then(user => {
        assert(user.posts[0].title === "PostTitle");
        done();
      });
  });

  // it("Can add subdocuments to an existing record", done => {
  //   const joe = new User({
  //     name: "Joe",
  //     posts: []
  //   });

  //   joe
  //     .save()
  //     .then(() => User.findOne({ name: "Joe" }))
  //     .then(user => {
  //       user.posts.push({ title: "New Post" });
  //       return user.save();
  //     })
  //     .then(() => User.findOne({ name: "Joe" }))
  //     .then(user => {
  //       assert(user.posts[0].title === "New Post");
  //       done();
  //     });
  // });

  it("can remove an existing subdocument", done => {
    const joe = new User({
      name: "Joe",
      posts: [{ title: "New Title" }]
    });

    joe
      .save()
      .then(() => User.findOne({ name: "Joe" }))
      .then(user => {
        // If we remove a subdocument from the parent, we need to save the new version of the parent document, in this case the User.
        user.posts[0].remove();
        return user.save();
      })
      .then(() => User.findOne({ name: "Joe" }))
      .then(user => {
        assert(user.posts.length === 0);
        done();
      });
  });
});
