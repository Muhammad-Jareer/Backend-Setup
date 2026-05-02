import multer from "multer";

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "newVideo" || file.fieldname === "videoFile") {
    if (!file.mimetype.startsWith("video/")) {
      return cb(new Error("Only video files allowed"), false);
    }
  }

  if (file.fieldname === "newThumbnail" || file.fieldname === "thumbnail") {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files allowed"), false);
    }
  }

  cb(null, true);
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024,
  },
});