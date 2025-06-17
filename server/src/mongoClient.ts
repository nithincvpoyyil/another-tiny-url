import { MongoClient } from "mongodb";

const MONGO_URL = process.env.MONGO_URL || "";

export const mongoClient = new MongoClient(MONGO_URL);

mongoClient.on("connect", () => {
  console.log("MongoDB Client Connected");
});

mongoClient.on("error", (err: any) => {
  console.error("MongoDB Client Error", err);
});

mongoClient.on("close", () => {
  console.log("MongoDB Client Connection Closed");
});

mongoClient.on("reconnect", () => {
  console.log("MongoDB Client Reconnected");
});

mongoClient.on("reconnectFailed", () => {
  console.error("MongoDB Client Reconnect Failed");
});

mongoClient.on("timeout", () => {
  console.error("MongoDB Client Connection Timeout");
});

export const connectToMongo = async () => {
  try {
    await mongoClient.connect();
  } catch (err) {
    throw new Error("Failed to connect to MongoDB");
  }
};
