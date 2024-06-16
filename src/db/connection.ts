import { MongoClient } from "mongodb";
import env from "../utils/validateEnv";

const client = new MongoClient(env.MONGODB_URI);

export const dbConnection = async () => {
  try {
    await client.connect();

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
};

export const db = client.db(env.DB_NAME);
