// api reference:: https://jestjs.io/docs/en/api

// this is a custom assume test, it only runs when the condition is true
// const assume = (condition) => (condition ? it : it.skip);

// example:: database population
beforeEach(() => console.log("Running before each"));
// example:: database reset
afterEach(() => console.log("Running after each"));

// example:: database connection or setup
beforeAll(() => console.log("Running before all"));
// example:: database disconnection or cleanup
afterAll(() => console.log("Running after all"));

// creates a block that groups together several related tests
describe("Example Test for Github Actions", () => {
  // runs the test
  test("True should be truthy", () => {
    expect(true).toBeTruthy();
  });
});
