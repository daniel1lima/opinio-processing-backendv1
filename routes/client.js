import express from 'express';
import { getAllReviews, getReviewsByCompId, getFrequencyReviewsByCompId } from "../controllers/client.js"

const router = express.Router();


router.get('/getAllReviews', getAllReviews);
router.get('/get_reviews', getReviewsByCompId);
router.get('/get_frequency_reviews', getFrequencyReviewsByCompId);
// router.get('/getSummariesByCompId', getSummariesByCompId);


export default router;

