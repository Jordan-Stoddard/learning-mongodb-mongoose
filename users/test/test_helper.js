const mongoose = require("mongoose");
// Reset mongoose's promise library for the ES6 global JS library.
mongoose.Promise = global.Promise;

// Before() is part of Mongoose, and allows you to run a function one
// time before any of our tests run.
before(done => {
  mongoose.connect("mongodb://localhost/users_test");
  mongoose.connection
    .once("open", () => {
      done();
    })
    .on("error", error => {
      console.warn("Warning", error);
    });
});

beforeEach(done => {
  const { users, comments, blogposts } = mongoose.connection.collections;
  // .drop takes in an anon function, which will run after .drop
  // completes. We then run done() and that is a signal to Mocha
  // That we're ready to run the rest of our tests.
  // This will clear collections within our DB so every test gets a new fresh set of collections before each test.
  users.drop(() => {
    comments.drop(() => {
      blogposts.drop(() => {
        done();
      })
    })
  });
});
