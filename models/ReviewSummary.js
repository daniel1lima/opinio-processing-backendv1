import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Define a new schema
const ReviewSummarySchema = new Schema({
  category: {
    type: String,
    required: true
  },
  average_sentiment: {
    type: Number,
    required: true
  },
  average_polarity: {
    type: Number,
    required: true
  },
  company_id: {
    type: String,
    required: true
  },
  industry_id: {
    type: String,
    required: true
  }
});

// Create a model based on the schema
const ReviewSummary = mongoose.model('ReviewSummary', ReviewSummarySchema);

export default ReviewSummary
