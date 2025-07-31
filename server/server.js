import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/mongodb.js';
import { clerkWebhook, stripeWebhook } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRouts.js';
import userRouter from './routes/userRoutes.js';


dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();


// Database Connection
await connectDB();
await connectCloudinary();

 // Middlewares
const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000'] 
    : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-clerk-auth-token'],
    preflightContinue: false,
    optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(clerkMiddleware());




// Routes
app.get('/', (req, res) => { res.send("Hare Krishna..")});
app.post('/clerk', clerkWebhook)
app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhook);





app.listen(PORT,() => console.log(`Server Started! ${PORT} `));