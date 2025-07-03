require("dotenv").config();
const express = require("express");
const http = require("http");
const Port = process.env.PORT;
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const db = require("./config/db");
const animalRoutes = require("./Routes/AnimalRoutes");
const farmRoutes = require("./Routes/FarmRoutes");



app.use(express.json());


app.use(cors({
  origin: "http://localhost:8080", 
  credentials: true
}));


app.use("/api", animalRoutes);
app.use("/api" , farmRoutes);

app.get("/", (req, res) => {
  res.send(`Server Is Created Successfully on Port ${Port}`);
});

server.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});

