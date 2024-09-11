import express from "express";
const app = express();
import db from "./db.js";

const port = 3000;

// Parsing Body Middleware
app.use(express.json())

// Logging Middleware
app.use((req, res, next) => {
  const time = new Date().toLocaleString();
  console.log("------");
  console.log(`${time}: Received a ${req.method} request to ${req.url}.`);
  if (Object.keys(req.body).length > 0) {
    console.log("Containing the data:");
    console.log(JSON.stringify(req.body));
  }
  next();
});

// Run express server
app.listen(port, () => console.log("Server is running on port:", port));
