import express from 'express';
import { getReviewsByCompId, getFrequencyReviewsByCompId } from "../controllers/client.js"

const router = express.Router();


router.get('/get_reviews', getReviewsByCompId);
router.get('/get_frequency_reviews', getFrequencyReviewsByCompId);
// router.get('/getSummariesByCompId', getSummariesByCompId);


export default router;

