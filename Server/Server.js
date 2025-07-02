require("dotenv").config();
const express = require("express");
const http = require("http");
const Port = process.env.PORT;
const app = express();
const server = http.createServer(app);
const db = require("./config/db");
const animalRoutes = require("./Routes/AnimalRoutes");




app.use(express.json());
app.use("/api", animalRoutes);

app.get("/", (req, res) => {
  res.send(`Server Is Created Successfully on Port ${Port}`);
});

server.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});

