const aws = require("aws-sdk");

const s3 = new aws.S3({ signatureVersion: "v4", region: process.env.AWS_REGION });

function extractKeyFromUrl(url) {
  if (!url) return null;
  try {
    // Supports virtual-hosted-style and path-style URLs
    const u = new URL(url);
    // If url like https://bucket.s3.region.amazonaws.com/key
    const hostParts = u.hostname.split(".");
    const isVirtualHosted = hostParts[1] === "s3";
    if (isVirtualHosted) {
      // pathname starts with /key
      return decodeURIComponent(u.pathname.replace(/^\//, ""));
    }
    // Path-style: https://s3.region.amazonaws.com/bucket/key
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return decodeURIComponent(parts.slice(1).join("/"));
    }
    return null;
  } catch (_e) {
    return null;
  }
}

async function getPresignedUrlFromUrl(url, expiresInSeconds = 300) {
  const bucket = process.env.AWS_S3_BUCKET;
  const key = extractKeyFromUrl(url);
  if (!bucket || !key) {
    throw new Error("Cannot generate presigned URL: missing bucket or key");
  }
  const params = {
    Bucket: bucket,
    Key: key,
    Expires: expiresInSeconds,
  };
  return s3.getSignedUrlPromise("getObject", params);
}

module.exports = { getPresignedUrlFromUrl };
 
// Delete an S3 object given its public HTTPS URL
async function deleteObjectFromUrl(url) {
  const bucket = process.env.AWS_S3_BUCKET;
  const key = extractKeyFromUrl(url);
  if (!bucket || !key) {
    return false;
  }
  try {
    await s3.deleteObject({ Bucket: bucket, Key: key }).promise();
    return true;
  } catch (_e) {
    return false;
  }
}

module.exports.deleteObjectFromUrl = deleteObjectFromUrl;


