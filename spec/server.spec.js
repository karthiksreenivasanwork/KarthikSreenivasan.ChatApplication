let request = require("request"); //NPM request for making http requests in our tests.

describe("get messages", () => {
  it("should return 200 Ok", (done) => {
    //'done' parameter helps us wait for the call back by making it asynchronous
    request.get("http://localhost:3000/messages", (err, res) => {
      expect(res.statusCode).toEqual(200);
      done();
    });
  });

  it("the data from the get 'messages' endpoint must not be empty", (done) => {
    //'done' parameter helps us wait for the call back by making it asynchronous
    request.get("http://localhost:3000/messages", (err, res) => {
      /**
       * Check whether the total number of JSON objects are greater than 0.
       * Here, each JSON object is a chat message.
       * Hence, we are checking if there are 1 or more messages available.
       */
      expect(JSON.parse(res.body).length).toBeGreaterThan(0);
      done();
    });
  });
});

describe("get messages from user", () => {
  it("should return 200 Ok", (done) => {
    //'done' parameter helps us wait for the call back by making it asynchronous
    request.get("http://localhost:3000/messages/karthik", (err, res) => {
      //console.log(JSON.parse(res.body));
      expect(res.statusCode).toEqual(200);
      done();
    });
  });

  it("name should be 'Karthik' ", (done) => {
    request.get("http://localhost:3000/messages/Karthik", (err, res) => {
      JSON.parse(res.body).forEach((element) => {
        expect(element.name).toEqual("Karthik");
      });
      done();
    });
  });
});
