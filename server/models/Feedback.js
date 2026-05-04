
const mongoose = require("mongoose")

const feedbackSchema = new mongoose.Schema(
  {
    name: String,
    message: String,
    rating: Number,
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Feedback = mongoose.models.Feedback || mongoose.model("Feedback",feedbackSchema) 

module.exports = Feedback