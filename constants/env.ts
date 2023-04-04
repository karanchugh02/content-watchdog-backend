import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT,
  S3_UPLOAD_KEY: process.env.S3_UPLOAD_KEY,
  S3_UPLOAD_SECRET: process.env.S3_UPLOAD_SECRET,
  BUCKET: process.env.BUCKET,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
};
