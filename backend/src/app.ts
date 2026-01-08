import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/error.middleware';
import { morganMiddleware } from './middleware/logger.middleware';
import { AppError } from './utils/AppError';
import authRoutes from './routes/auth.routes';
import teamRoutes from './routes/team.routes';
import taskRoutes from './routes/task.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from './config/swagger';

const app: Express = express();

// Trust proxy (required for Railway/Heroku/Render) to ensure secure cookies work
app.set('trust proxy', 1);

// Global Middlewares

// Set security HTTP headers
app.use(helmet());

// Cookie Parser
app.use(cookieParser() as any);

// Development logging
app.use(morganMiddleware);

// Limit requests from same API
const limiter = rateLimit({
  max: 10000,
  windowMs: 15 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Enable CORS
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
    'https://onekode-assessment.netlify.app'
  ],
  credentials: true
}));

// Swagger Documentation
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Handle unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorHandler);

export default app;
