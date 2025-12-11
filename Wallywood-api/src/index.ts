import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authRoutes } from './routes/authRoutes.js';
import { posterRoutes } from './routes/posterRoutes.js';
import { genreRoutes } from './routes/genreRoutes.js';
import { userRoutes } from './routes/userroutes.js';
import { cartLineRoutes } from './routes/cartLineRoutes.js';
import { userRatingRoutes } from './routes/userRatingRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posters', posterRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartLineRoutes);
app.use('/api/ratings', userRatingRoutes);

// Global error handler to expose 500 issues
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Server error', detail: err?.message || err });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});