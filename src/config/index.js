import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  port: process.env.PORT,
  mongouri: process.env.MONGO_URI,
  jwt_secret: process.env.JWT_SECRET,
};