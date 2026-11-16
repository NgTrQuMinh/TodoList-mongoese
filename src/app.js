import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes/index.js';
import notFound from './middleware/404.js';
import errorHandler from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimit.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', apiLimiter, router);

app.use(notFound);
app.use(errorHandler);

export default app;
