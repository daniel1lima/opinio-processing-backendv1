import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    sentences: String,
    processed_sentences: String,
    bert_embeddings: [Number], // Assuming it's an array of numbers (768-dimensional embeddings)
    cluster: Number,
    assigned_label: [String], // Assuming it's an array of strings
    named_labels: [String], // Assuming it's an array of strings
    sentiment: Number,
    polarity: Number,
    company_id: String,
    industry_id: String,
    platform_id: String,
    date: Date,
  }
);

const Review = mongoose.model("Reviews", ReviewSchema);

export default Review;
