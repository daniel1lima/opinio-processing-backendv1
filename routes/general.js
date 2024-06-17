import express from 'express';
import { getUser, getCompanyId } from "../controllers/general.js";





const router = express.Router();

router.get("/user/:id", getUser);
router.get("/company/:comp_id", getCompanyId);
router.get("/client/:comp_id/:value", getReviewData);






export default router;