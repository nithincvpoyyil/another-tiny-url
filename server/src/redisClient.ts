import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL || "",
});

redisClient.on("connect", () => console.log("Redis Client Connected"));
redisClient.on("error", (err: any) => console.log("Redis Client Error", err));
redisClient.on("close", () => console.log("Redis Client Connection Closed"));

export const connectToRedis = async () => {
  
  if (redisClient.isOpen || redisClient.isReady) {
    return;
  }

  try {
    await redisClient
      .connect()
      .then(() => console.log("Redis Client Connected"));
  } catch (err) {
    console.log("Redis Client Error", err);
  }
};
