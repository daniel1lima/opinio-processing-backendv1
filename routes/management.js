import express from 'express';
import { addCompany, addUser } from "../controllers/management.js"

const router = express.Router();

router.post('/postCompany', addCompany)
router.post('/postUser', addUser)

export default router;