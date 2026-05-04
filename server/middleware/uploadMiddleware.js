const multer = require("multer");
const { createStorage, isCloudinaryConfigured } = require("../config/cloudinary");

const imageFileFilter = (_req, file, cb) => {
  if (!file.mimetype?.startsWith("image/")) {
    const error = new Error("Only image files are allowed");
    error.statusCode = 400;
    cb(error);
    return;
  }

  cb(null, true);
};

const createUploader = (folder) => {
  const storage = createStorage(folder);

  return multer({
    storage,
    fileFilter: imageFileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
};

const uploadBookImage = createUploader("bookweb/books");
const uploadProfileImage = createUploader("bookweb/profiles");

module.exports = {
  isCloudinaryConfigured,
  uploadBookImage,
  uploadProfileImage,
};
