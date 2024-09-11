import { MongoClient } from "mongodb";
import "dotenv/config";

// Retrieve the MongoDB connection string and database name from environment variables
const connectionString = process.env.ATLAS_URI;
const database = process.env.DATABASE;
const DEBUG = process.env.DEBUG;

async function connectDb(database) {
  try {
    // Create a new MongoClient instance with the connection string
    let client = new MongoClient(connectionString);
    // Attempt to connect to the MongoDB server
    let conn = await client.connect();
    // Log a message indicating successful connection
    console.log("MongoDB connected:", conn.options.appName);
    // Return the specified database from the connected client
    return conn.db(database);
  } catch (err) {
    console.error(err.stack);
  }
}

const db = connectDb(database);

export default db;
