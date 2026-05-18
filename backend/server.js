import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { syncDB } from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import startCronJobs from './services/cronService.js';
import rateLimiter from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(rateLimiter);

app.get('/', (req, res) => res.json({ message: 'Offer Letter API running' }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/offers', emailRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(errorHandler);

const start = async () => {
  await syncDB();
  startCronJobs();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();
