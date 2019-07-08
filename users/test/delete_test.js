const assert = require("assert");
const User = require("../src/user.js");

describe("tests deleting users from our Users table", () => {
  let joe;

  beforeEach(done => {
    joe = new User({ name: "Joe" });
    joe.save().then(() => done());
  });

  // model == user instance
  it("model instance remove", done => {
    joe
      // call .remove on the instance of joe
      .remove()
      // then when this completes, run findOne to find
      // a user by the name of 'Joe'
      // then when that comes back, assert that it comes back
      // as null, then run done()
      .then(() => User.findOne({ name: "Joe" }))
      .then(user => {
        assert(user === null);
        done();
      });
  });

  // all of the below use methods on the table.
  it("class method remove", done => {
    // this method removes all users with the name of Joe.
    User.remove({ name: "Joe" })
      .then(() => User.findOne({ name: "Joe" }))
      .then(user => {
        assert(user === null);
        done();
      });
  });

  it("class method findOneAndRemove", done => {
    User.findOneAndRemove({ name: "Joe" })
      .then(() => User.findOne({ name: "Joe" }))
      .then(user => {
        assert(user === null);
        done();
      });
  });

  it("class method findByIdAndRemove", done => {
    User.findByIdAndRemove(joe._id)
      .then(() => User.findOne({ joe: "Joe" }))
      .then(user => {
        assert(user === null);
        done();
      });
  });
});
