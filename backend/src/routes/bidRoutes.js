import { Router } from 'express';
import { createBid, listBidsForGig, hireBid } from '../controllers/bidController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, createBid);
router.get('/:gigId', requireAuth, listBidsForGig);
router.patch('/:bidId/hire', requireAuth, hireBid);

export default router;
