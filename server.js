let express = require("express");
let bodyParser = require("body-parser");
let app = express();
/**
 * Support for socket.io as it can't work with express directly.
 */
let http = require("http").Server(app); //Node HTTP Server.
let io = require("socket.io")(http); //Initialize socket.io with the Node HTTP Server.

/**
 * Use the mongoose npm to connect to the mongo db database.
 */
let mongoose = require("mongoose");
const { sendStatus } = require("express/lib/response");

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

/**
 * Please use your mongo db connection string as a part of the configuration.
 * I have removed my connection string for security reasons.
 *
 * NOTE: Additionaly, in production hidden in a configuration file that is safe.
 */
let dbUrl = "";

/**
 * Model definition to store our message to the database.
 * Mongoose manages the ID generation and maintenance for each message
 */
let Message = mongoose.model("Message", {
  name: String,
  message: String,
});

/**
 * A HTTP get method that sents all the messages stored in the message collection.
 */
app.get("/messages", (req, res) => {
  /**
   * {} => Indicates all the messages from the database.
   * (err, messages) => This is a call back function with the data or error response.
   */
  Message.find({}, (err, messages) => {
    if (err) sendStatus(500);
    res.send(messages);
  });
});

/**
 * An HTTP post method that handles a new message sent by a client by adding it to a message collection.
 * Additionally, it informs all the clients using socket.io to cascade the new message.
 */
app.post("/message", async (req, res) => {
  let message = new Message(req.body);
  let savedMessage = await message.save();
  let censored = await Message.findOne({ message: "badword" }); // Filter any bad words here
  if (censored) await Message.deleteOne({ _id: censored.id });
  else io.emit("message", req.body); // Update the chat message to all the client.
  res.sendStatus(200);

  // .catch((err) => {
  //   console.log(
  //     "Unable to save the information to the database. Please find the error appended : ",
  //     err
  //   );
  //   res.sendStatus(500);
  //   return console.error(err);
  // });
});

/**
 * The event that is fired when a new client has joined the chat.
 */
io.on("connection", (socket) => {
  //console.log("A user connected");
});

/**
 * Connect to the Mongo DB database
 */
mongoose.connect(dbUrl, (err) => {
  if (!err) console.log("Application connected to Mongo DB Cloud");
  else
    console.log(
      "Unable to connect to Mongo DB Cloud. Please find the error appended : ",
      err
    );
});

/**
 * Start the server
 */
let server = http.listen(3000, () => {
  console.log(`Server is listening on the port : ${server.address().port}`);
});
