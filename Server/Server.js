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
const inverterRoutes = require("./Routes/InverterRoute");
const deathRoutes = require("./Routes/DeathRoute");
const SlaughterRoutes = require("./Routes/SlaughterRoutes")
const IncidentRoute = require("./Routes/IncidentRoutes")
const  QuarantineAnimal = require("./Routes/Quarantine")

app.use(express.json());


app.use(cors({
  origin: "http://localhost:8080", 
  credentials: true
}));


app.use("/api", animalRoutes);
app.use("/api" , farmRoutes);
app.use("/api", inverterRoutes);
app.use("/api", deathRoutes);
app.use("/api", SlaughterRoutes);
app.use("/api" , IncidentRoute);
app.use("/api" ,QuarantineAnimal);

app.get("/", (req, res) => {
  res.send(`Server Is Created Successfully on Port ${Port}`);
});

server.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});

