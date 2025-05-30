import mongoose from "mongoose";

const validateMongoIdFromReqParams = (req, res, next) => {
  const expenseId = req.params.id;

  const isValid = mongoose.isValidObjectId(expenseId);

  if (!isValid) {
    return res.status(400).send({ message: "Invalid expense ID." });
  }

  next();
};

export { validateMongoIdFromReqParams };
