import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/mongodb.js';
import { clerkWebhook } from './controllers/webhooks.js';

const PORT = process.env.PORT || 5000;
const app = express();

dotenv.config();

// Database Connection

 await connectDB();

app.use(cors());

app.get('/', (req, res) => {
  res.send("Hare Krishna..");

});

app.post('/clerk',express.json(),clerkWebhook)

app.listen(PORT,() => console.log(`Server Started! ${PORT} `));