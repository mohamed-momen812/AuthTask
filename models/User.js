const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "User must have name"],
  },
  email: {
    type: String,
    required: [true, "User must have email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Email is unvalid"],
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: 8,
    select: false,
  },
  idDocument: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

// pre hock
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
