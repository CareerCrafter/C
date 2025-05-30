import jwt from "jsonwebtoken";
import UserTable from "../user/user.model.js";
import bcrypt from "bcryptjs";

const isUser = async (req, res, next) => {
  const authorization = req?.headers?.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }

  const token = authorization.split(" ")[1];

  try {
    const secretKey = process.env.JWT_SECRET; // Make sure to set this in your environment variables
    const payload = jwt.verify(token, secretKey);

    // Find user by id from token payload
    const user = await UserTable.findById(payload.id);

    if (!user) {
      return res.status(401).send({ message: "Unauthorized. User not found." });
    }

    // Optional: check if user is active/enabled, adapt according to your schema
    if (user.isActive === false) {
      return res
        .status(403)
        .send({ message: "Access denied. User is inactive." });
    }

    // Attach user object to request for downstream use
    req.user = user;

    next();
  } catch (error) {
    return res
      .status(401)
      .send({ message: "Unauthorized. Invalid or expired token." });
  }
};

export default isUser;
