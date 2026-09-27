import { getMyTransactions } from "@/controllers/transactionsController";
import { connectDB } from "@/lib/db";
import isAuthenticated from "@/middlewares/auth";

export default async function handler(req, res) {
    await connectDB();

    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res
            .status(405)
            .json({ error: `Method ${req.method} not allowed` });
    }

    return isAuthenticated(req, res, () => getMyTransactions(req, res));
}
