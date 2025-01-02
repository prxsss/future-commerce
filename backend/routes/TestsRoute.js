import express, { text } from 'express';

import * as testsController from '../controllers/testsController.js';

const router = express.Router();

router.post('/upload', testsController.uploadTest);

export default router;
