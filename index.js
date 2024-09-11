import express from "express";
const app = express();
import db from "./db.js";

const port = 3000;

// Run express server
app.listen(port, () => console.log("Server is running on port:", port));
