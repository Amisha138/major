const express = require("express");
const { getMyBooks, updateProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { uploadProfileImage } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/mybooks", protect, getMyBooks);
router.patch("/profile", protect, uploadProfileImage.single("profilePic"), updateProfile);

module.exports = router;
