import express from 'express';
import { addCompany } from "../controllers/management.js"

const router = express.Router();

router.post('/postCompany', addCompany)

export default router;