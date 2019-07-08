const assert = require("assert");
const User = require("../src/user.js");

describe("updating records", () => {
  let joe;

  beforeEach(done => {
    joe = new User({ name: "Joe", likes: 0 });
    joe.save().then(() => done());
  });

  // Helper function
  // assertName takes in a operation like joe.save() or joe.update() etc and then runs the operation with some tests.
  function assertName(operation, done) {
    operation
      .then(() => User.find({})) // If we use .find with an empty object, it should give us all of the records in the table.
      .then(users => {
        assert(users.length === 1);
        assert(users[0].name === "Alex");
        done();
      });
  }

  // using .set is useful when you may want to make multiple updates to a record at different times or in different ways.
  // You can use .set multiple times and then not use .save until you've gotten to the point that you're ready to make the change to the DB.
  it("model instance type, using set and save", done => {
    // When using .set this is not making any change to the record in the DB.
    // It is only making the change to our instance of User joe saved in memory.
    joe.set("name", "Alex");
    // To persist, we will use save().
    assertName(joe.save(), done);
  });

  // Immediately updates a user's properties.
  it("A model instance can update", done => {
    assertName(joe.update({ name: "Alex" }), done);
  });

  it("A model class can update", done => {
    // User.update will find every record in the User table with the name property of 'Joe'
    // and replace the name property with the value of 'Alex'.
    assertName(User.update({ name: "Joe" }, { name: "Alex" }), done);
  });

  it("A model class can update one record", done => {
    // findOneAndUpdate will find the first user with the property that matches the first object passed in
    // and updates it with the second object passed in.
    assertName(User.findOneAndUpdate({ name: "Joe" }, { name: "Alex" }), done);
  });

  it("A model class can find a record with an ID and update", done => {
    // findbyIdAndUpdate does the same as above but finds the record by the specific ._id.
    assertName(User.findByIdAndUpdate(joe._id, { name: "Alex" }), done);
  });

  // Here we're using a special syntax for MongoDB called an Update Operator
  // What this does is actually makes the change inside the DB without having to pull it to our server or frontend.
  // I think you can think of this like lambda functions. DB functions, essentially.
  it("A user can have their postCount incremented by 1", done => {
    // .update finds all records that match the property passed in the first argument.
    // Then in the second argument it makes an update.
    // Because we're trying to increment a number inside the record, we're going to use the $inc MongoDB Update Operator
    // We pass in an object with the property $inc, then the value of the $inc property will be an object with the name of the
    // property we want to update within the records found by .update, and then the value is the amount we want to increment.
    // So in this case, we're incrementing postCount by 1. If we wanted to increment it by 10 we would write
    // { $inc: { postCount: 10 } }
    User.update({ name: "Joe" }, { $inc: { likes: 1 } })
      .then(() => User.findOne({ name: "Joe" }))
      .then(user => {
        assert(user.likes === 1);
        done();
      });
  });
});
