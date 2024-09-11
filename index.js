import express from "express";
const app = express();
const port = 3000;

// Run express server
app.listen(port, () => console.log("Server is running on port:", port));
