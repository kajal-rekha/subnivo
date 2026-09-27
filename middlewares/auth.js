import User from "@/models/User";
import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new Error("Invalid token format.");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new Error("No token provided");
    }

    const { id, userId } = jwt.verify(token, process.env.JWT_SECRET);
    const authenticatedUserId = id || userId;

    if (!authenticatedUserId) {
      throw new Error("Invalid token payload");
    }

    req.user = await User.findById(authenticatedUserId);

    if (!req.user) {
      throw new Error("User not found");
    }

    await next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      res.status(401).json({ error: "Invalid token" });
    } else res.status(403).json({ error: "Unauthorized access" });
  }
};

export default isAuthenticated;
