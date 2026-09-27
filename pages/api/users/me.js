import {
  changeCurrentUserPassword,
  getCurrentUserProfile,
} from "@/controllers/userController";
import { connectDB } from "@/lib/db";
import isAuthenticated from "@/middlewares/auth";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "GET" && req.method !== "PUT") {
    res.setHeader("Allow", ["GET", "PUT"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  return isAuthenticated(req, res, async () => {
    if (req.method === "GET") {
      return getCurrentUserProfile(req, res);
    }

    return changeCurrentUserPassword(req, res);
  });
}
