const assert = require("assert");
const User = require("../src/user.js");

// this test is just doing synchronous checks based on memory.
describe("Validating records", () => {
  it("requires a user name", () => {
    const user = new User({ name: undefined });
    // validateSync is a function that checks that every object in the database is correct in a synchronous fashion.
    const validationResult = user.validateSync();
    const { message } = validationResult.errors.name;

    assert(message === "Name is required.");
  });

  // this test is just doing synchronous checks based on memory.
  it("requires a user name longer than 2 characters", () => {
    const user = new User({ name: "Al" });
    const validationResult = user.validateSync();
    const { message } = validationResult.errors.name;

    assert(message === "Name must be longer than 2 characters.");
  });

  // this test is attempting to insert an invalid User schema to our db, and checking that we get the error we're expecting.
  it("disallows invalid records from being saved", done => {
    const user = new User({ name: "Al" });
    user.save().catch(validationResult => {
      const { message } = validationResult.errors.name;
      assert(message === "Name must be longer than 2 characters.");
      done();
    });
  });
});
