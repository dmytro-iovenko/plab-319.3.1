import express from "express";
const app = express();
import db from "./db.js";
import error from "./utils/error.js";

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

// Route Endpoints:
// 	Get /listings: Get all listings from the database.
app.get("/listings", async (req, res) => {
  const collection = await db.collection("listingsAndReviews");
  const result = await collection.find().limit(10).toArray();
  console.log(result);
});
// 	Get /listings/:id: Get a specific listing by its ID.
// 	Get /listings/query: Get listings based on specific query parameters.

// Query Parameters:
// 	property_type: Filter listings by property type (e.g., "Apartment", "Condominium").
// 	accommodates: Filter listings by the number of people accommodated.
// 	price: Filter listings by price range.
// 	min_reviews: Filter listings by minimum number of reviews.

// Add other params such sort…
// 	Post /listings: add a new document to the db
// 	Delete /listings/:id : Delete a document using id
// 	Put /listings/:id : update a document using the body

// Extra
// 	Instead of sending data raw, send it in html format, where you only have the name of each listing, and make it clickable, if you click on it. It takes you to the listing page   /listings/:id Where you have all information
// 	Add button to delete and update
// 	Add update page where you have a form that update the document

// 404 Middleware
app.use((req, res) => {
  throw error(404, "Resource Not Found");
});

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
