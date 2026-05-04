const asyncHandler = require("express-async-handler");
const Book = require("../models/Book");
const User = require("../models/User");
const {
  destroyUploadedAsset,
  getUploadedAsset,
} = require("../config/cloudinary");

const sanitizeUser = (user) => {
  const safeUser = user.toObject();
  delete safeUser.password;
  return safeUser;
};

const getMyBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({ uploader: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: {
      books,
    },
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const name = req.body.name?.trim();
  const mobile = req.body.mobile?.trim();
  let uploadedAsset;

  if (mobile && mobile !== user.mobile) {
    const existingMobileUser = await User.findOne({
      mobile,
      _id: { $ne: user._id },
    });

    if (existingMobileUser) {
      res.status(400);
      throw new Error("A user with this mobile number already exists");
    }
  }

  try {
    if (req.file) {
      uploadedAsset = getUploadedAsset(req.file, "bookweb/profiles");
    }

    if (name) {
      user.name = name;
    }

    if (mobile) {
      user.mobile = mobile;
    }

    if (uploadedAsset?.url) {
      const previousProfilePic = user.profilePic;
      user.profilePic = uploadedAsset.url;

      if (previousProfilePic) {
        try {
          await destroyUploadedAsset(previousProfilePic);
        } catch (_cleanupError) {
        }
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        user: sanitizeUser(user),
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

module.exports = {
  getMyBooks,
  updateProfile,
};
