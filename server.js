let express = require("express");
let app = express();

app.use(express.static(__dirname));
let server = app.listen(3000, () => {
  console.log(`Server is listening on the port : ${server.address().port}`);
});
