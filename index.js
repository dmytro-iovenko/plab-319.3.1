import express from "express";
const app = express();
import db from "./db.js";

const port = 3000;

// Parsing Body Middleware
app.use(express.json());

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

app.use("/", (req,res)=>{
    throw new Error("Test Error")
})

// Error-handling Middleware
app.use((err, req, res, next) => {
  const time = new Date();
  const status = err.status || 500;
  res.status(status);
  res.json({
    status: status,
    error: err.message,
    timestamp: time,
    path: req.url,
  });
  console.error("------");
  console.error(`${time.toLocaleString()}: ${err.stack}`);
});

// Run express server
app.listen(port, () => console.log("Server is running on port:", port));
