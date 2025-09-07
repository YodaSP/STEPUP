const AWS = require('aws-sdk');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Configure AWS S3
const s3 = new AWS.S3({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// S3 bucket configuration
const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'kaam-uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB

// Allowed file types
const ALLOWED_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
};

// Generate unique filename
const generateFileName = (originalName, mimetype) => {
  const ext = ALLOWED_TYPES[mimetype] || path.extname(originalName);
  const randomName = crypto.randomBytes(16).toString('hex');
  return `${randomName}${ext}`;
};

// Multer configuration for memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

// Upload file to S3
const uploadToS3 = async (file, folder = 'uploads') => {
  try {
    const fileName = generateFileName(file.originalname, file.mimetype);
    const key = `${folder}/${fileName}`;

    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'private', // Private by default, can be made public if needed
    };

    const result = await s3.upload(uploadParams).promise();
    
    return {
      success: true,
      url: result.Location,
      key: result.Key,
      bucket: BUCKET_NAME,
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Delete file from S3
const deleteFromS3 = async (key) => {
  try {
    const deleteParams = {
      Bucket: BUCKET_NAME,
      Key: key,
    };

    await s3.deleteObject(deleteParams).promise();
    
    return {
      success: true,
      message: 'File deleted successfully',
    };
  } catch (error) {
    console.error('S3 delete error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Generate signed URL for private file access
const getSignedUrl = async (key, expiresIn = 3600) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Expires: expiresIn,
    };

    const url = await s3.getSignedUrlPromise('getObject', params);
    
    return {
      success: true,
      url,
    };
  } catch (error) {
    console.error('S3 signed URL error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Middleware for single file upload
const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    const uploadSingleFile = upload.single(fieldName);
    
    uploadSingleFile(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
      }

      try {
        const result = await uploadToS3(req.file, 'uploads');
        
        if (result.success) {
          req.file.s3Url = result.url;
          req.file.s3Key = result.key;
          next();
        } else {
          res.status(500).json({
            success: false,
            message: 'File upload failed',
            error: result.error,
          });
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'File upload failed',
          error: error.message,
        });
      }
    });
  };
};

// Middleware for multiple file upload
const uploadMultiple = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    const uploadMultipleFiles = upload.array(fieldName, maxCount);
    
    uploadMultipleFiles(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded',
        });
      }

      try {
        const uploadPromises = req.files.map(file => uploadToS3(file, 'uploads'));
        const results = await Promise.all(uploadPromises);
        
        const successfulUploads = results.filter(result => result.success);
        const failedUploads = results.filter(result => !result.success);
        
        if (successfulUploads.length > 0) {
          req.files = req.files.map((file, index) => ({
            ...file,
            s3Url: successfulUploads[index]?.url,
            s3Key: successfulUploads[index]?.key,
          }));
        }
        
        if (failedUploads.length > 0) {
          console.warn('Some files failed to upload:', failedUploads);
        }
        
        next();
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'File upload failed',
          error: error.message,
        });
      }
    });
  };
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadToS3,
  deleteFromS3,
  getSignedUrl,
  generateFileName,
};
