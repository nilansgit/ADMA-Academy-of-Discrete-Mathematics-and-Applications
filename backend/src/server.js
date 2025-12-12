import app from './app.js';
import dotenv from 'dotenv';
import { testConnection } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

await testConnection();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
