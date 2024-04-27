import express from "express";
import * as dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello from DALL-E!" });
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;
  
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const image_url = response?.data[0]?.b64_json;


    if (!image_url) {
      throw new Error("Image URL not found in the response");
    }

    res.status(200).json({ photo: image_url });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || "Something went wrong");
  }
});

export default router;
