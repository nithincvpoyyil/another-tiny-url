import crypto from "node:crypto";
import { redisClient, connectToRedis } from "./redisClient.js";
import { connectToMongo, mongoClient } from "./mongoClient.js";
import { TinyUrlRequest, TinyURLSchema } from "./types.js";

const DATABASE = "tinyurlDB";
const COLLECTION_NAME = "tinyurls";

const generateShortUrl = (url: string): string => {
  const hash = crypto.createHash("sha256");
  hash.update(url);
  const hashedVal = hash.digest("hex");
  return `${hashedVal.substring(0, 8)}${hashedVal.substring(hashedVal.length - 8)}`;
};

export const createTinyURl = async (
  request: TinyUrlRequest,
): Promise<TinyURLSchema> => {
  const urlInput = request.url?.trim().toLowerCase();

  if (
    !urlInput ||
    (!urlInput.startsWith("http://") && !urlInput.startsWith("https://"))
  ) {
    throw new Error("Invalid request: URL must start with http:// or https://");
  }

  const tinyHash = generateShortUrl(urlInput);

  await connectToRedis();

  const duplicatedRequest = await redisClient.get(tinyHash);

  if (duplicatedRequest) {
    console.log(
      `Cache hit, tinyHash : ${tinyHash} for url :${urlInput} exists`,
    );
    return { url: urlInput, shortUrl: tinyHash }; // Return cached URL
  }

  await connectToMongo();

  const db = mongoClient.db(DATABASE);
  const collection = db.collection<TinyURLSchema>(COLLECTION_NAME);

  // Check MongoDB for existing URL
  const existingUrlDocument = await collection.findOne({ url: urlInput });

  if (existingUrlDocument) {
    console.log(
      `Cache miss, Db Called - tinyHash : ${tinyHash} for url :${urlInput} exists`,
    );
    return existingUrlDocument; // Return existing URL if found
  }

  const record: TinyURLSchema = {
    url: urlInput,
    shortUrl: tinyHash,
    createdAt: new Date(),
  };

  await collection.insertOne(record);
  await redisClient.set(tinyHash, urlInput, { EX: 3600 }); // Cache for 1 hour
  return record;
};

export const getOriginalUrl = async (
  tinyHash: string,
): Promise<TinyURLSchema> => {
  tinyHash = tinyHash?.trim().toLowerCase();

  if (!tinyHash.length) {
    throw new Error("Invalid tinyHash");
  }

  await connectToRedis();

  const cachedUrl = await redisClient.get(tinyHash);
  if (cachedUrl) {
    return { url: cachedUrl, shortUrl: tinyHash }; // Return cached URL if found
  }
  console.log("Cache miss:", tinyHash);
  // If not found in Redis, check MongoDB
  await connectToMongo();
  const db = mongoClient.db(DATABASE);
  const collection = db.collection<TinyURLSchema>(COLLECTION_NAME);
  // Check MongoDB for existing URL
  const savedRecord = await collection.findOne({ shortUrl: tinyHash });

  if (savedRecord) {
    return savedRecord;
  }

  return Promise.reject(new Error("URL not found"));
};
