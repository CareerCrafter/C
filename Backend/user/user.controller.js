import express from "express";
import UserTable from "./user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Yup from "yup";
import cors from "cors";

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse incoming JSON requests
const router = express.Router();

// register
router.post(
  "/user/register",
  async (req, res, next) => {
    // create schema
    const userValidationSchema = Yup.object({
      fullName: Yup.string().required().trim().max(255),
      email: Yup.string().email().required().trim().max(100).lowercase(),
      address: Yup.string().notRequired().max(255).trim(),
      password: Yup.string().required().trim().min(8).max(30),
      gender: Yup.string()
        .required()
        .trim()
        .oneOf(["male", "female", "other", "preferNotToSay"]),

      phoneNumber: Yup.string().required().trim().min(10).max(20),
    });

    try {
      req.body = await userValidationSchema.validate(req.body);
      next();
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    //   extract new user from req.body
    const newUser = req.body;

    // find user with provided email
    const user = await UserTable.findOne({ email: newUser.email });

    // if user exists, throw error
    if (user) {
      return res.status(409).send({ message: "Email already exists." });
    }

    // hash
    // requirement => plain password, salt rounds
    const plainPassword = newUser.password;
    const saltRounds = 10; //randomness
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // replace plain password by hashed password
    newUser.password = hashedPassword;

    await UserTable.create(newUser);

    return res
      .status(201)
      .send({ message: "User is registered successfully." });
  }
);

// login route
router.post("/user/login", async (req, res) => {
  const loginCredentials = req.body;
  console.log("Login attempt with:", loginCredentials); // Log the received credentials

  const user = await UserTable.findOne({ email: loginCredentials.email });
  console.log("Found user:", user); // Log the user object found in the database

  if (!user) {
    console.log("User not found");
    return res.status(404).send({ message: "Invalid credentials." });
  }

  const plainPassword = loginCredentials.password;
  const hashedPassword = user.password;
  console.log("Plain password:", plainPassword);
  console.log("Hashed password from DB:", hashedPassword);

  const isPasswordMatch = await bcrypt.compare(plainPassword, hashedPassword);
  console.log("Password match:", isPasswordMatch);

  if (!isPasswordMatch) {
    console.log("Password mismatch");
    return res.status(404).send({ message: "Invalid credentials." });
  }

  // remove password
  user.password = undefined;

  //  generate access token
  // secretkey
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    return res.status(500).send({ message: "JWT secret key not configured." });
  }

  // payload => object inside token
  const payload = { email: user.email };

  // encrypted cipher text
  const token = jwt.sign(payload, secretKey, {
    expiresIn: "7d",
  });

  return res
    .status(200)
    .send({ message: "success", userDetails: user, accessToken: token });
});

export { router as userController };
