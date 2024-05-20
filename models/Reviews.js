import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  Sentences: { type: String, required: true },
  processed_sentences: { type: String, required: true },
  bert_embeddings: { type: [Number], required: true },
  cluster: { type: Number, required: true },
  assigned_label: { type: [String], required: true },
  named_labels: { type: [String], required: true },
  sentiment: { type: Number, required: true },
  polarity: { type: Number, required: true },
  company_id: { type: String, required: true },
  industry_id: { type: Number, required: true },
  platform_id: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  review_rating: { type: Number, required: true }
});

const Review = mongoose.model('Review', ReviewSchema);


export default Review;