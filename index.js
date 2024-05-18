import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";

import { Webhook } from "svix";
import ClerkUser from "./models/ClerkUser.js";

// Data imports
import User from "./models/User.js";
import { dataUser, dataTransaction, dataCompanies } from "./data/index.js";
import Transaction from "./models/Transaction.js";
import Company from "./models/Company.js";

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

// MONGOOSE SETUP

// Deals with user creation
// app.post(
//   "/api/webhooks",
//   bodyParser.raw({ type: "application/json" }),
//   async function (req, res) {
//     try {
//       const headers = req.headers;
//       const payload = req.body;

//       const svix_id = headers["svix-id"];
//       const svix_timestamp = headers["svix-timestamp"];
//       const svix_signature = headers["svix-signature"];

//       // If there are missing Svix headers, error out
//       if (!svix_id || !svix_timestamp || !svix_signature) {
//         return new Response("Error occured -- no svix headers", {
//           status: 400,
//         });
//       }

//       console.log(svix_id, svix_timestamp, svix_signature);

//       const wh = new Webhook(process.env.WEBHOOK_SECRET);

//       const { id, firstName, lastName } = payload.data ?? {};

//       const { email_address } = payload.data?.email_addresses?.[0] ?? {};

//       const eventType = payload.type;

//       console.log(id);
//       console.log(eventType);
//       console.log(email_address);

//       if (eventType === "user.created") {
//         const existingUser = ClerkUser.findOne({ clerkUserId: id });
//         if (existingUser) {
//           console.log("User already exists");
//           return res.status(400).json({
//             success: false,
//             message: "User already exists",
//           });
//         }

//         const user = new ClerkUser({
//           clerkUserId: id,
//           firstName: firstName,
//           lastName: lastName,
//           email_address: email_address,
//         });

//         await user.save();
//         // // console.log(`User ${id} is ${eventType}`);
//         // // console.log(attributes);
//       }

//       res.status(200).json({
//         success: true,
//         message: "Webhook received",
//       });
//     } catch (err) {
//       console.log(err);
//       res.status(400).json({
//         success: false,
//         message: err.message,
//       });
//     }
//   }
// );




const PORT = process.env.PORT || 9000;

mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => {
    console.log("Connected to DB");
    //  app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    //  Only add once
    //  User.insertMany(dataUser);
    // Transaction.insertMany(dataTransaction);
    // Company.insertMany(dataCompanies);
    // console.log("inserted")

  })
  .catch((error) => console.log(`${error} did not connect`));

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
