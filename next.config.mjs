/** @type {import('next').NextConfig} */
import { config as dotenvConfig } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const currentDir = dirname(fileURLToPath(import.meta.url));
dotenvConfig({ path: join(currentDir, '.env') });

const nextConfig = {
  env: {
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    SERVERLESS_API_URL: process.env.SERVERLESS_API_URL,    
  },
};

export default nextConfig;
