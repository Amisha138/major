const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Book = require("../models/Book");
const {
  destroyUploadedAsset,
  getUploadedAsset,
} = require("../config/cloudinary");

const normalizeCategory = (category) => category?.trim().toLowerCase();

const normalizeCondition = (condition) => {
  if (!condition) {
    return "";
  }

  const conditionMap = {
    "like new": "Like New",
    good: "Good",
    fair: "Fair",
    poor: "Poor",
  };

  return conditionMap[condition.trim().toLowerCase()] || condition.trim();
};

const parsePositiveNumber = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : Number.NaN;
};

const parseBoolean = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  const normalizedValue = String(value).trim().toLowerCase();

  if (normalizedValue === "true") {
    return true;
  }

  if (normalizedValue === "false") {
    return false;
  }

  return undefined;
};

const getBooks = asyncHandler(async (req, res) => {
  const search = req.query.search?.trim();
  const category = normalizeCategory(req.query.category);
  const condition = normalizeCondition(req.query.condition);
  const minPrice = parsePositiveNumber(req.query.minPrice);
  const maxPrice = parsePositiveNumber(req.query.maxPrice);
  const openToExchange = parseBoolean(req.query.openToExchange);
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 12, 1), 50);

  const query = {
    isAvailable: true,
  };

  if (search) {
    query.$or = [
      { bookname: { $regex: search, $options: "i" } },
      { bookauthor: { $regex: search, $options: "i" } },
      { bookpublication: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { wantedBooks: { $regex: search, $options: "i" } },
    ];
  }

  if (category && category !== "all") {
    query.bookclass = category;
  }

  if (condition) {
    query.bookCondition = condition;
  }

  if (openToExchange === true) {
    query.openToExchange = true;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    if (Number.isNaN(minPrice) || Number.isNaN(maxPrice)) {
      res.status(400);
      throw new Error("Price filters must be valid numbers");
    }

    query.bookprice = {};

    if (minPrice !== undefined) {
      query.bookprice.$gte = minPrice;
    }

    if (maxPrice !== undefined) {
      query.bookprice.$lte = maxPrice;
    }
  }

  const totalBooks = await Book.countDocuments(query);
  const books = await Book.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: {
      books,
      totalPages: Math.max(Math.ceil(totalBooks / limit), 1),
      currentPage: page,
      totalBooks,
    },
  });
});

const getBookById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid book ID");
  }

  const book = await Book.findById(id).populate("uploader", "name email mobile");

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  res.status(200).json({
    success: true,
    data: {
      book,
    },
  });
});

const createBook = asyncHandler(async (req, res) => {
  const bookname = req.body.bookname?.trim();
  const bookauthor = req.body.bookauthor?.trim();
  const bookpublication = req.body.bookpublication?.trim();
  const booklanguage = req.body.booklanguage?.trim() || "Hindi";
  const bookclass = normalizeCategory(req.body.bookclass);
  const bookCondition = normalizeCondition(req.body.bookCondition);
  const description = req.body.description?.trim();
  const wantedBooks = req.body.wantedBooks?.trim();
  const bookprice = parsePositiveNumber(req.body.bookprice);
  const bookvolume = parsePositiveNumber(req.body.bookvolume);
  const openToExchange = parseBoolean(req.body.openToExchange) === true;

  if (!bookname || !bookauthor || !bookclass || !bookCondition || bookprice === undefined) {
    res.status(400);
    throw new Error(
      "Book name, author, price, class, and condition are required",
    );
  }

  if (Number.isNaN(bookprice) || bookprice < 0) {
    res.status(400);
    throw new Error("Book price must be a valid number");
  }

  if (bookvolume !== undefined && (Number.isNaN(bookvolume) || bookvolume < 0)) {
    res.status(400);
    throw new Error("Book volume must be a valid number");
  }

  if (openToExchange && !wantedBooks) {
    res.status(400);
    throw new Error("Wanted books are required when exchange is enabled");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("Book image is required");
  }

  let uploadedAsset;

  try {
    uploadedAsset = getUploadedAsset(req.file, "bookweb/books");

    const book = await Book.create({
      bookname,
      bookauthor,
      bookpublication,
      booklanguage,
      bookvolume,
      bookprice,
      bookclass,
      bookCondition,
      description,
      openToExchange,
      wantedBooks: openToExchange ? wantedBooks : undefined,
      image: uploadedAsset.url,
      uploader: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: {
        book,
      },
    });
  } catch (error) {
    if (uploadedAsset?.url) {
      try {
        await destroyUploadedAsset(uploadedAsset.url);
      } catch (_cleanupError) {
      }
    }

    throw error;
  }
});

const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid book ID");
  }

  const book = await Book.findById(id);

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  if (book.uploader.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can only delete your own books");
  }

  if (book.image) {
    await destroyUploadedAsset(book.image);
  }

  await book.deleteOne();

  res.status(200).json({
    success: true,
    data: {
      message: "Book deleted successfully",
      bookId: id,
    },
  });
});

const markBookUnavailable = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid book ID");
  }

  const book = await Book.findById(id).populate("uploader", "name email mobile");

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  if (book.uploader._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can only update your own books");
  }

  if (!book.isAvailable) {
    res.status(200).json({
      success: true,
      data: {
        book,
      },
    });
    return;
  }

  book.isAvailable = false;
  await book.save();

  res.status(200).json({
    success: true,
    data: {
      book,
    },
  });
});

module.exports = {
  createBook,
  deleteBook,
  getBookById,
  getBooks,
  markBookUnavailable,
};
