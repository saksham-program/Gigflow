import mongoose from "mongoose";
import { z } from "zod";
import { Bid } from "../models/Bid.js";
import { Gig } from "../models/Gig.js";

const createBidSchema = z.object({
  gigId: z.string().min(1),
  message: z.string().min(5),
  price: z.number().nonnegative()
});

export async function createBid(req, res) {
  const parsed = createBidSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0].message });
  }

  const { gigId, message, price } = parsed.data;

  const gig = await Gig.findById(gigId);
  if (!gig) return res.status(404).json({ message: "Gig not found" });
  if (gig.status !== "open") {
    return res.status(400).json({ message: "Gig is not open for bids" });
  }
  if (gig.ownerId.toString() === req.user.id) {
    return res.status(400).json({ message: "You cannot bid on your own gig" });
  }

  const bid = await Bid.create({
    gigId,
    freelancerId: req.user.id,
    message,
    price,
    status: "pending"
  });

  return res.status(201).json({ bid });
}

export async function listBidsForGig(req, res) {
  const { gigId } = req.params;

  const gig = await Gig.findById(gigId);
  if (!gig) return res.status(404).json({ message: "Gig not found" });
  if (gig.ownerId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const bids = await Bid.find({ gigId })
    .sort({ createdAt: -1 })
    .populate("freelancerId", "name email");

  return res.json({ bids, gig });
}

// ✅ Atomic hiring logic using MongoDB transaction
export async function hireBid(req, res) {
  const { bidId } = req.params;

  const session = await mongoose.startSession();

  try {
    let hiredBid;

    await session.withTransaction(async () => {
      const bid = await Bid.findById(bidId).session(session);
      if (!bid) throw Object.assign(new Error("Bid not found"), { statusCode: 404 });

      const gig = await Gig.findById(bid.gigId).session(session);
      if (!gig) throw Object.assign(new Error("Gig not found"), { statusCode: 404 });

      if (gig.ownerId.toString() !== req.user.id) {
        throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
      }

      // 🔒 Prevent race conditions
      const updatedGig = await Gig.findOneAndUpdate(
        { _id: gig._id, status: "open" },
        { $set: { status: "assigned" } },
        { new: true, session }
      );

      if (!updatedGig) {
        throw Object.assign(new Error("Gig already assigned"), { statusCode: 409 });
      }

      // Mark selected bid as hired
      const updatedBid = await Bid.findOneAndUpdate(
        { _id: bid._id, status: "pending" },
        { $set: { status: "hired" } },
        { new: true, session }
      ).populate("freelancerId", "name email");

      if (!updatedBid) {
        throw Object.assign(new Error("Bid cannot be hired"), { statusCode: 409 });
      }

      // Reject all other bids
      await Bid.updateMany(
        { gigId: gig._id, _id: { $ne: bid._id }, status: "pending" },
        { $set: { status: "rejected" } },
        { session }
      );

      hiredBid = updatedBid;
    });

    return res.json({ bid: hiredBid });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message || "Error"
    });
  } finally {
    session.endSession();
  }
}

