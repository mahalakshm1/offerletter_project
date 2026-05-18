import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { syncDB } from './models/index.js';
import redis from './config/redis.js';
import rateLimiter from './middleware/rateLimiter.js';
import auditLogger from './middleware/auditLogger.js';
import sanitizeInput from './middleware/sanitize.js';
import errorHandler from './middleware/errorHandler.js';
import startCronJobs from './services/cronService.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import auditRoutes from './routes/auditRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing + security
app.use(express.json({ limit: '10kb' }));   // prevent large payload attacks
app.use(sanitizeInput);                      // strip $ and . keys (NoSQL injection)
app.use(rateLimiter);                        // global rate limit
app.use(auditLogger);                        // log all write actions

// Health check
app.get('/', (req, res) => res.json({ status: 'ok', message: 'Offer Letter API running' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/offers', emailRoutes);
app.use('/api/offers', pdfRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/logs', auditRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Global error handler (must be last)
app.use(errorHandler);

const start = async () => {
  try { await redis.connect(); } catch { console.warn('Redis unavailable — cache disabled'); }
  await syncDB();
  startCronJobs();
  app.listen(PORT, () => console.log(`Server running on port ${PORT} [${process.env.NODE_ENV}]`));
};

start();
