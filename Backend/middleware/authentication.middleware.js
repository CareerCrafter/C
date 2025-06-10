// authentication.middleware.js

import jwt from "jsonwebtoken";
import UserTable from "../user/user.model.js"; // Adjust path if necessary
// No need for bcryptjs here, it's used in user controller for password hashing/comparison

const isUser = async (req, res, next) => {
  const authorizationHeader = req?.headers?.authorization; // Correctly get authorization header

  // 1. Check for authorization header presence and format
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided or malformed." });
  }

  const token = authorizationHeader.split(" ")[1];

  // 2. Check if token string is actually extracted
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  // 3. Get JWT Secret
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    // This indicates a critical server configuration issue
    console.error("JWT secret key is not configured in environment variables!");
    return res
      .status(500)
      .json({ message: "Server configuration error: JWT secret missing." });
  }

  try {
    // 4. Verify the token
    const decoded = jwt.verify(token, secretKey);

    // 5. Find the user in the database using the email from the decoded token
    // This is the critical step to get the user's _id from the DB
    const user = await UserTable.findOne({ email: decoded.email });

    // 6. Check if user exists in the database
    if (!user) {
      // This means the token is valid but the user doesn't exist or is deactivated
      return res
        .status(404)
        .json({ message: "User not found or account deactivated." });
    }

    // Optional: check if user is active/enabled, if you have such a field in your schema
    // if (user.isActive === false) {
    //   return res.status(403).json({ message: "Access denied. User account is inactive." });
    // }

    // 7. Attach the user object (including its _id) to the request object
    // This makes req.user._id available to subsequent middleware and route handlers
    req.user = user;

    // 8. Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired. Please log in again." });
    }
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "Invalid token. Please log in again." });
    }

    // Handle any other unexpected errors during authentication
    console.error("Authentication error in isUser middleware:", error);
    return res.status(500).json({ message: "Failed to authenticate request." });
  }
};

export default isUser;
