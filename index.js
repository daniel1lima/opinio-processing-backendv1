import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";

import { Webhook } from "svix";
import ClerkUser from "./models/User.js";

// Data imports

import { dataUser, dataTransaction, dataCompanies } from "./data/index.js";
import { reviewsData } from "./data/reviews.js";
import { reviewSummaries } from "./data/summaries.js";
import Transaction from "./models/Transaction.js";
import Company from "./models/Company.js";
import Reviews from "./models/Reviews.js";
import ReviewSummary from "./models/ReviewSummary.js";

// Config

dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// // Routes
app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);

// Status route
app.get("/status", (req, res) => {
  res.json({ status: "Server is running" });
});

// DynamoDB Setup
import AWS from "aws-sdk"; // Add AWS SDK import

// Replace Mongoose setup with DynamoDB setup
AWS.config.update({
  region: process.env.AWS_REGION, // Set your AWS region
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Set your AWS access key
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Set your AWS secret key
  ...(process.env.USE_LOCAL_DYNAMODB === 'true' && { endpoint: process.env.DYNAMODB_URL })
});

const dynamoDB = new AWS.DynamoDB.DocumentClient(); // Create DynamoDB DocumentClient

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});