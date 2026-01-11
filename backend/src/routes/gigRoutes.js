import { Router } from 'express';
import { createGig, listGigs, getGig } from '../controllers/gigController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', listGigs);
router.post('/', requireAuth, createGig);
router.get('/:id', getGig);

export default router;
