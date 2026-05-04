const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    profilePic: {
      type: String,
      default: "",
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
