const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const requiredEnv = [
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_REGION",
  "AWS_S3_BUCKET",
];

requiredEnv.forEach((k) => {
  if (!process.env[k]) {
    // Do not throw at startup; allow app to run and return a clear error on upload usage
    // eslint-disable-next-line no-console
    console.warn(`[s3Upload] Missing env ${k}. S3 uploads will fail until set.`);
  }
});

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new aws.S3({ signatureVersion: "v4" });

function buildKey(req, file) {
  const timestamp = Date.now();
  const safeName = (file.originalname || "file").replace(/[^a-zA-Z0-9._-]/g, "_");
  // Group by entity for easier browsing
  const entity = req.baseUrl.includes("students")
    ? "students"
    : req.baseUrl.includes("executives")
    ? "executives"
    : req.baseUrl.includes("employers")
    ? "employers"
    : "misc";
  const field = file.fieldname || "file";
  return `${entity}/${field}/${timestamp}-${safeName}`;
}

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET || "",
    acl: "private", // keep objects private; we will serve via presigned URLs
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (_req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      try {
        cb(null, buildKey(req, file));
      } catch (err) {
        cb(err);
      }
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

module.exports = upload;


