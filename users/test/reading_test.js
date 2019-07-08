const assert = require("assert");
const User = require("../src/user");

describe("Reading users out of the database", () => {
  let joe;

  beforeEach(done => {
    joe = new User({ name: "Joe" });
    joe.save().then(() => {
      done();
    });
  });

  it("finds all users with a name of Joe", done => {
    // Note: _id in MongoDB is an object id not a raw string,
    // therefore, if you wish to compare it you must convert
    // it to a string first.
    User.find({ name: "Joe" }).then(users => {
      assert(joe._id.toString() === users[0]._id.toString());
      done();
    });
  });

  it("finds a single user by id", done => {
    User.findOne({ _id: joe._id }).then(user => {
      assert(user.name === "Joe");
      done();
    });
  });
});
