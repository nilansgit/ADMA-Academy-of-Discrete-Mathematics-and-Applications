import multer from "multer";
import path from "path";

const PHOTO_MAX = 2 * 1024 * 1024;     // 2 MB
const RECEIPT_MAX = 5 * 1024 * 1024;   // 5 MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "passportPhoto") {
      cb(null, "uploads/membership/photos");
    } else if (file.fieldname === "paymentReceipt") {
      cb(null, "uploads/membership/receipts");
    } else {
      cb(new Error("Invalid field"), null);
    }
  },

  filename: (req, file, cb) => {
    const {uuid} = req.params;
    const ext = path.extname(file.originalname);

    if (file.fieldname === "passportPhoto") {
      cb(null, `${uuid}_pp${ext}`);
    } else {
      cb(null, `${uuid}_receipt${ext}`);
    }
  }
});

/**
 * IMPORTANT:
 * file.size IS available here in Multer
 */
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf"
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Invalid file type"), false);
  }

  // Per-file size validation
  if (file.fieldname === "passportPhoto" && file.size > PHOTO_MAX) {
    return cb(new Error("Photo must be ≤ 2MB"), false);
  }

  if (file.fieldname === "paymentReceipt" && file.size > RECEIPT_MAX) {
    return cb(new Error("Receipt must be ≤ 5MB"), false);
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: RECEIPT_MAX // absolute max = 5MB
  }
});
