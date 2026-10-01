import {
  createSubscription,
  getAllSubscriptions,
} from "@/controllers/subscriptionController";
import { connectDB } from "@/lib/db";
import isAuthenticated from "@/middlewares/auth";
import isAdmin from "@/middlewares/isAdmin";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    return createSubscription(req, res);
  } else if (req.method === "GET") {
    return isAuthenticated(req, res, async () => {
      return isAdmin(req, res, () => getAllSubscriptions(req, res));
    });
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
