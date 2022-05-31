let express = require("express");
let bodyParser = require("body-parser");
let app = express();
/**
 * Support for socket.io as it can't work with express directly.
 */
let http = require("http").Server(app); //Node HTTP Server.
let io = require("socket.io")(http); //Initialize socket.io with the Node HTTP Server.

/**
 * The express.static() function is a built-in middleware function in Express.
 * It serves static files and is based on serve-static
 */
app.use(express.static(__dirname));
/**
 * Attach the body-parser npm as a middleware to receive the body data.
 * Here, we are letting body parser know that our expected data format is JSON
 * for our HTTP requests.
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let messages = [];

/**
 * A HTTP get method that sents all the messages stored in the message collection.
 */
app.get("/messages", (req, res) => {
  res.send(messages);
});

/**
 * An HTTP post method that handles a new message sent by a client by adding it to a message collection.
 * Additionally, it informs all the clients using socket.io to cascade the new message.
 */
app.post("/message", (req, res) => {
  messages.push(req.body);
  /**
   * Update the chat message to all the client.
   */
  io.emit("message", req.body);
  res.sendStatus(200);
});

/**
 * The event that is fired when a new client has joined the chat.
 */
io.on("connection", (socket) => {
  console.log("A user connected");
});

/**
 * Start the server
 */
let server = http.listen(3000, () => {
  console.log(`Server is listening on the port : ${server.address().port}`);
});
