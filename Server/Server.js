const express = require("express");
const http = require("http");
const Port = 5000;
const app = express();
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send(`Server Is Created Successfully on Port ${Port}`);
});

server.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});
