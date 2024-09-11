import express from "express";
const app = express();
import db from "./db.js";
import error from "./utils/error.js";
import { Decimal128 } from "mongodb";

const port = 3000;

// Parsing Body Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.get("/listings", async (req, res, next) => {
  try {
    const collection = db.collection("listingsAndReviews");
    const results = collection.find();
    res.locals = results;
    next();
  } catch (err) {
    next(err);
  }
});
// 	Get /listings/:id: Get a specific listing by its ID.
app.get("/listings/:id", async (req, res, next) => {
  try {
    const query = { _id: req.params.id };
    const collection = db.collection("listingsAndReviews");
    const result = await collection.findOne(query);
    if (result) res.json(result).status(200);
    else next();
  } catch (err) {
    next(err);
  }
});
// 	Get /listings/query: Get listings based on specific query parameters.
app.get("/listings/query", async (req, res, next) => {
  try {
    const query = getQueryParameters(req.query);
    const collection = db.collection("listingsAndReviews");
    let results = collection.find(query);
    res.locals = results;
    next();
  } catch (err) {
    next(err);
  }
});

// Query Parameters:
function getQueryParameters(params) {
  const query = {};
  for (const param in params) {
    switch (param) {
      // property_type: Filter listings by property type (e.g., "Apartment", "Condominium").
      case "property_type":
        query[param] = params[param];
        break;
      // accommodates: Filter listings by the number of people accommodated.
      case "accommodates":
        query[param] = Number(params[param]);
        break;
      // price: Filter listings by price range.
      case "price":
        const price = params[param].split("-");
        if (price.length > 1) {
          query[param] = {};
          const [min, max] = price;
          if (min) query[param].$gte = Decimal128.fromString(min);
          if (max) query[param].$lte = Decimal128.fromString(max);
        } else {
          query[param] = Decimal128.fromString(price[0]);
        }
        break;
      // min_reviews: Filter listings by minimum number of reviews.
      case "min_reviews":
        // filter using number_of_reviews
        query.number_of_reviews = { $gte: Number(params[param]) };
        // OR by comparing the size of the array
        // $expr allows the use of aggregation expressions within the find query
        query.$expr = {
          $gte: [
            {
              // $size gets the number of elements in the reviews array
              $size: "$reviews",
            },
            Number(params[param]),
          ],
        };
        break;
    }
  }
  console.log(query);
  return query;
}

// Filter by other params such limit…
app.use(async (req, res, next) => {
  try {
    let data = res.locals;
    // sort data, if necessary
    if (req.query.sort) {
      const query = {};
      req.query.sort.split(",").forEach((p) => {
        const [key, value] = p.split(":");
        console.log(key, value);
        query[key] = value;
      });
      data = data.sort(query);
    }
    // limit data, if necessary
    if (req.query.limit) data = data.limit(Number(req.query.limit));
    // convert filtered data to an array
    data = await data.toArray();
    console.log(data);
    res.json(data);
  } catch (err) {
    next(error(400, err));
  }
});

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
