const express = require("express");
const {
  createBook,
  deleteBook,
  getBookById,
  getBooks,
  markBookUnavailable,
} = require("../controllers/bookController.js");
const { protect } = require("../middleware/authMiddleware.js");
const { uploadBookImage } = require("../middleware/uploadMiddleware.js");

const router = express.Router();

router.route("/").get(getBooks).post(protect, uploadBookImage.single("image"), createBook);
router.patch("/:id/unavailable", protect, markBookUnavailable);
router.route("/:id").get(getBookById).delete(protect, deleteBook);

module.exports = router;
