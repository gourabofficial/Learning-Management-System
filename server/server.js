import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/mongodb.js';
import { clerkWebhook } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';

const PORT = process.env.PORT || 5000;
const app = express();

dotenv.config();

// Database Connection
 await connectDB();

 // Middlewares
app.use(cors());
app.use(clerkMiddleware());

// Routes

app.get('/', (req, res) => { res.send("Hare Krishna..")});
app.post('/clerk', express.json(), clerkWebhook)
app.use('/api/educator', express.json(),educatorRouter);




app.listen(PORT,() => console.log(`Server Started! ${PORT} `));