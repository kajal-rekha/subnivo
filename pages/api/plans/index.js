import { createPlan, getAllPlans } from "@/controllers/planController";
import { connectDB } from "@/lib/db";
import isAuthenticated from "@/middlewares/auth";
import isAdmin from "@/middlewares/isAdmin";

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    return res.status(503).json({ error: "Database unavailable" });
  }

  if (req.method === "POST") {
    await isAuthenticated(req, res, async () => {
      await isAdmin(req, res, async () => {
        return createPlan(req, res);
      });
    });
  } else if (req.method === "GET") {
    return getAllPlans(req, res);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
