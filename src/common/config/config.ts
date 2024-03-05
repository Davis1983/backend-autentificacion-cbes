import { registerAs } from '@nestjs/config';
export default registerAs('config', () => {
  return {
    postgresUrl: process.env.DATABASE_URL,
  };
});
