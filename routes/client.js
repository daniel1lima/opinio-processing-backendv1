import express from 'express';
import { getAllReviews, getReviewsByCompId, getSummariesByCompId } from "../controllers/client.js"

const router = express.Router();


router.get('/getAllReviews', getAllReviews);
router.get('/getReviewsByCompId', getReviewsByCompId);
router.get('/getSummariesByCompId', getSummariesByCompId);


export default router;

