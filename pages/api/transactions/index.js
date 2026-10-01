import {
  getAllTransactions,
  getMyTransactions,
} from "@/controllers/transactionsController";
import { connectDB } from "@/lib/db";
import isAuthenticated from "@/middlewares/auth";
import isAdmin from "@/middlewares/isAdmin";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  return isAuthenticated(req, res, async () => {
    if (req.user?.role === "admin") {
      return isAdmin(req, res, () => getAllTransactions(req, res));
    }

    return getMyTransactions(req, res);
  });
}
