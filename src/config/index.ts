import { config } from 'dotenv';
config({ path: '.env' });

export const { PORT, JWT_SECRET_KEY } = process.env;
export const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB } = process.env;
