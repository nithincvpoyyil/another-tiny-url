import * as express from "express";
const app = express.default();
const port = process.env.PORT || 3000;

import { TinyUrlRequest } from "./types.js";
import { createTinyURl, getOriginalUrl } from "./tinyUrlCore.js";

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the TinyURL API" });
});

app.get("/:tinyHash", async (req, res) => {
  const tinyHash = req.params.tinyHash ?? "";

  if (!tinyHash || !tinyHash.length) {
    return res.status(400).json({ error: "Invalid request - query empty" });
  }

  try {
    const record = await getOriginalUrl(tinyHash);
    if (!record.url) {
      throw new Error("URL not found");
    }
    res.redirect(301, record.url);
  } catch (error) {
    res.status(404).json({ error: "URL not found" });
  }
});

app.post("/create", async (req, res) => {
  const requestBody = req.body as TinyUrlRequest;

  if (!requestBody || !requestBody.url) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const newRecord = await createTinyURl(requestBody);
    return res
      .status(201)
      .json({ message: "URL created successfully", data: newRecord });
  } catch (error) {
    return res.status(400).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.listen(port, () => {
  console.log(`TinyServer is running on ${port}`);
});
