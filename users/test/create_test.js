const assert = require("assert");
const User = require("../src/user.js");

describe("Creating records", () => {
  // when we pass the 'done' keyword into the it block,
  // It gives us the ability to add async to our it function.
  // We then call it inside our .then when we've completed our test
  // To let Mocha know that this test is done, and you can
  // move on to the next test.
  it("saves a user", (done) => {
    const joe = new User({ name: "Joe" });
    // .save() will cause mongoose to attempt to assert this object to
    // our mongo DB.
    joe.save()
      .then(() => {
        // Has Joe been saved successfully?
        assert(!joe.isNew);
        done();
      });
  });
});
