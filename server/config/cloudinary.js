const path = require("path");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const getCredentials = () => ({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
});

const isCloudinaryConfigured = () => {
  const { cloudName, apiKey, apiSecret } = getCredentials();
  return Boolean(cloudName && apiKey && apiSecret);
};

const isMockUploadsEnabled = () => process.env.ALLOW_MOCK_UPLOADS === "true";

const configureCloudinary = () => {
  if (!isCloudinaryConfigured()) {
    return cloudinary;
  }

  const { cloudName, apiKey, apiSecret } = getCredentials();

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  return cloudinary;
};

const sanitizeBaseName = (filename) =>
  path
    .parse(filename || "image")
    .name.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "image";

const createCloudinaryStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary: configureCloudinary(),
    params: async (_req, file) => ({
      folder,
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "svg"],
      public_id: `${Date.now()}-${sanitizeBaseName(file.originalname)}`,
    }),
  });

const createStorage = (folder) => {
  if (isCloudinaryConfigured()) {
    return createCloudinaryStorage(folder);
  }

  return undefined;
};

const extractPublicIdFromUrl = (imageUrl) => {
  if (!imageUrl) {
    return "";
  }

  try {
    const { pathname } = new URL(imageUrl);
    const segments = pathname.split("/").filter(Boolean);
    const uploadIndex = segments.findIndex((segment) => segment === "upload");

    if (uploadIndex === -1) {
      return "";
    }

    const publicIdParts = segments.slice(uploadIndex + 1);

    if (publicIdParts.length === 0) {
      return "";
    }

    if (/^v\d+$/.test(publicIdParts[0])) {
      publicIdParts.shift();
    }

    if (publicIdParts.length === 0) {
      return "";
    }

    const lastPart = publicIdParts.pop();
    publicIdParts.push(lastPart.replace(/\.[^.]+$/, ""));

    return publicIdParts.join("/");
  } catch (_error) {
    return "";
  }
};

const buildMockUploadResult = (file, folder) => {
  const extension = path.extname(file.originalname || ".jpg").replace(".", "") || "jpg";
  const publicId = `${folder}/${Date.now()}-${sanitizeBaseName(file.originalname)}`;

  return {
    url: `https://res.cloudinary.com/demo/image/upload/v${Date.now()}/${publicId}.${extension}`,
    publicId,
  };
};

const getUploadedAsset = (file, folder) => {
  if (!file) {
    return null;
  }

  if (file.path) {
    return {
      url: file.path,
      publicId: file.filename || extractPublicIdFromUrl(file.path),
    };
  }

  if (isMockUploadsEnabled()) {
    return buildMockUploadResult(file, folder);
  }

  throw new Error("Cloudinary is not configured");
};

const destroyUploadedAsset = async (imageUrl) => {
  if (!imageUrl) {
    return;
  }

  if (!isCloudinaryConfigured()) {
    if (isMockUploadsEnabled()) {
      return;
    }

    throw new Error("Cloudinary is not configured");
  }

  const publicId = extractPublicIdFromUrl(imageUrl);

  if (!publicId) {
    throw new Error("Unable to determine Cloudinary public ID");
  }

  await configureCloudinary().uploader.destroy(publicId, {
    resource_type: "image",
  });
};

module.exports = {
  configureCloudinary,
  createStorage,
  destroyUploadedAsset,
  extractPublicIdFromUrl,
  getUploadedAsset,
  isCloudinaryConfigured,
  isMockUploadsEnabled,
};
