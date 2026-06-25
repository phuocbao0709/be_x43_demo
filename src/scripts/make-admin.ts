import { connectDb } from '../config/db';
import { UserModel } from '../models/user.model';

const emailArgIndex = process.argv.findIndex((arg) => arg === '--email');
const email = emailArgIndex >= 0 ? process.argv[emailArgIndex + 1] : process.argv[2];

const run = async () => {
  if (!email) {
    console.error('Usage: npm run make-admin -- user@email.com');
    process.exit(1);
  }

  await connectDb();

  const normalizedEmail = email.toLowerCase();
  const before = await UserModel.findOne({ email: normalizedEmail }).lean();

  const user = await UserModel.findOneAndUpdate(
    { email: normalizedEmail },
    { $set: { role: 'admin' } },
    { new: true, runValidators: true }
  ).lean();

  if (!user) {
    console.error(`User not found: ${email}`);
    process.exit(1);
  }

  console.log(`Before: ${before?.role ?? 'missing role'} -> After: ${user.role}`);
  console.log(`Updated ${user.email} to admin`);
  console.log('Remember to log out and log in again so the new token carries role=admin.');
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
