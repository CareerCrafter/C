import mongoose from "mongoose";

// set rule/schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    lowercase: true,
    unique: true, //index => same email cannot be repeated in user table
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    required: true,
    trim: true,
    enum: ["male", "female", "other", "preferNotToSay"],
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20,
    minlength: 10,
  },
  address: {
    type: String,
    required: false,
    trim: true,
    maxlength: 255,
  },
});

// create table/model/collection
const UserTable = mongoose.model("User", userSchema);

export default UserTable;

// user table
// _id
// fullName
// email
// password
// gender
// phoneNumber
// address

// mongodb+srv://riddhima22013226:riddhim@123@cluster0.nj2afcy.mongodb.net/

// mongodb+srv://riddhima22013226:riddhim@123@cluster0.nj2afcy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
