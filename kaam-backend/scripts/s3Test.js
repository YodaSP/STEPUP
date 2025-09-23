const fs = require('fs');
const path = require('path');
// Load .env if present, otherwise load env
const dotEnvPath = path.join(__dirname, '..', '.env');
const altEnvPath = path.join(__dirname, '..', 'env');
if (fs.existsSync(dotEnvPath)) {
  require('dotenv').config({ path: dotEnvPath });
} else if (fs.existsSync(altEnvPath)) {
  require('dotenv').config({ path: altEnvPath });
} else {
  require('dotenv').config();
}
const aws = require('aws-sdk');

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_S3_BUCKET,
} = process.env;

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION || !AWS_S3_BUCKET) {
  console.error('Missing AWS env vars. Required: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET');
  process.exit(1);
}

aws.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

const s3 = new aws.S3({ signatureVersion: 'v4' });

async function main() {
  const key = `healthchecks/${Date.now()}-s3-test.txt`;
  const body = Buffer.from('S3 connectivity test from StepUP backend');

  try {
    // 1) Put an object
    await s3.putObject({ Bucket: AWS_S3_BUCKET, Key: key, Body: body, ContentType: 'text/plain' }).promise();
    console.log('✅ PutObject succeeded:', key);

    // 2) Generate a presigned URL to GET it
    const url = await s3.getSignedUrlPromise('getObject', { Bucket: AWS_S3_BUCKET, Key: key, Expires: 60 });
    console.log('✅ Presigned GET URL (valid 60s):');
    console.log(url);

    // 3) Clean up
    await s3.deleteObject({ Bucket: AWS_S3_BUCKET, Key: key }).promise();
    console.log('✅ Deleted test object');

    console.log('🎉 S3 connection and permissions look good.');
  } catch (err) {
    console.error('❌ S3 test failed:', err.code || err.name, '-', err.message);
    process.exit(1);
  }
}

main();


