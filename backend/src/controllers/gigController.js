import { z } from 'zod';
import { Gig } from '../models/Gig.js';

const createGigSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  budget: z.number().nonnegative()
});

export async function listGigs(req, res) {
  const { q } = req.query;
  const filter = { status: 'open' };
  if (q && String(q).trim()) {
    filter.$text = { $search: String(q).trim() };
  }

  const gigs = await Gig.find(filter)
    .sort({ createdAt: -1 })
    .limit(100)
    .populate('ownerId', 'name email');

  return res.json({ gigs });
}

export async function createGig(req, res) {
  const parsed = createGigSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0].message });

  const gig = await Gig.create({ ...parsed.data, ownerId: req.user.id, status: 'open' });
  return res.status(201).json({ gig });
}

export async function getGig(req, res) {
  const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');
  if (!gig) return res.status(404).json({ message: 'Gig not found' });
  return res.json({ gig });
}
