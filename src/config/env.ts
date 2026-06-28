import dotenv from 'dotenv';

dotenv.config();

const rawEnv = process.env as Record<string, string | undefined>;

const parseClientUrls = (value: string | undefined) =>
  (value ?? 'http://localhost:5173')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const env = {
  port: Number(rawEnv.PORT ?? 5000),
  mongoUri: rawEnv.MONGO_URI ?? '',
  jwtSecret: rawEnv.JWT_SECRET ?? '',
  jwtExpiresIn: rawEnv.JWT_EXPIRES_IN ?? '1d',
  clientUrl: rawEnv.CLIENT_URL ?? 'http://localhost:5173',
  clientUrls: parseClientUrls(rawEnv.CLIENT_URLS ?? rawEnv.CLIENT_URL),
  smtpHost: rawEnv.SMTP_HOST ?? '',
  smtpPort: Number(rawEnv.SMTP_PORT ?? 587),
  smtpSecure: rawEnv.SMTP_SECURE === 'true',
  smtpUser: rawEnv.SMTP_USER ?? '',
  smtpPass: rawEnv.SMTP_PASS ?? '',
  emailFrom: rawEnv.EMAIL_FROM ?? '',
  otpExpiresMinutes: Number(rawEnv.OTP_EXPIRES_MINUTES ?? 10),
  resetTokenExpiresMinutes: Number(rawEnv.RESET_TOKEN_EXPIRES_MINUTES ?? 15),
  cloudinaryCloudName: rawEnv.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: rawEnv.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: rawEnv.CLOUDINARY_API_SECRET
};

if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
  console.warn('Warning: Cloudinary env vars not set. Avatar upload will not work.');
}

if (!env.mongoUri || !env.jwtSecret) {
  console.warn('Warning: Missing required environment variables (MONGO_URI, JWT_SECRET). The API will not work until they are set.');
}
