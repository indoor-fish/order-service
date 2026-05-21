import express, { Request, Response, NextFunction } from 'express';
import orderRoutes from './routes/orders.routes';
import cartRoutes from './routes/cart.routes';
import { AppError } from '@indoor-fish/shared-libs';

const app = express();
const PORT = process.env.PORT ?? 3004;

app.use(express.json());
app.use('/orders', orderRoutes);
app.use('/cart', cartRoutes);
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'order-service' }));

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.httpStatus).json({ error: err.message, code: err.code });
  }
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => console.log(`Order service running on port ${PORT}`));
