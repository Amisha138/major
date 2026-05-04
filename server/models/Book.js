const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    bookname: {
      type: String,
      required: [true, "Book name is required"],
      trim: true,
    },
    bookauthor: {
      type: String,
      required: [true, "Book author is required"],
      trim: true,
    },
    bookpublication: {
      type: String,
      trim: true,
    },
    booklanguage: {
      type: String,
      default: "Hindi",
      trim: true,
    },
    bookvolume: {
      type: Number,
    },
    bookprice: {
      type: Number,
      required: [true, "Book price is required"],
    },
    bookclass: {
      type: String,
      required: [true, "Book class is required"],
      enum: ["class 9", "class 10", "class 11", "class 12", "diploma"],
    },
    bookCondition: {
      type: String,
      required: [true, "Book condition is required"],
      enum: ["Like New", "Good", "Fair", "Poor"],
    },
    description: {
      type: String,
      trim: true,
    },
    openToExchange: {
      type: Boolean,
      default: false,
    },
    wantedBooks: {
      type: String,
      trim: true,
    },
    image: {
      type: [String],
      trim: true,
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Uploader is required"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);

const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);

module.exports = Book;
