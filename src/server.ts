import { connectDb } from './config/db';
import { env } from './config/env';
import { createApp } from './create-app';

const start = async () => {
  await connectDb();
  createApp().listen(env.port, () => {
    console.log(`Backend running at http://localhost:${env.port}`);
  });
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
