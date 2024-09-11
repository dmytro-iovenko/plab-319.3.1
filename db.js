import { MongoClient } from "mongodb";
import "dotenv/config";

// Retrieve the MongoDB connection string and database name from environment variables
const connectionString = process.env.ATLAS_URI;
const database = process.env.DATABASE;

// Create a new MongoClient instance with the connection string
let client = new MongoClient(connectionString);
let conn;

try {
  // Attempt to connect to the MongoDB server
  conn = await client.connect();
  // Log a message indicating successful connection
  console.log("MongoDB connected:", conn.options.appName);
} catch (err) {
  // Log any errors that occur during the connection attempt
  console.error(err);
}

// Access the specified database from the connected client
let db = conn.db(database);

export default db;
