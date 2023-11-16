import 'dotenv/config.js';
import express from 'express';
import { connectDB } from './config/database.js';
import bodyParser from 'body-parser';
import router from './api/routes/index.js';
import cors from 'cors';

await connectDB();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: '*' }));

app.use('/api', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
