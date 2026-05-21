import { Router } from 'express';
import { createOrder, getOrder, cancelOrder, updateStatus } from '../services/order.service';
import { OrderStatus } from '@indoor-fish/shared-libs';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { userId, lines } = req.body;
    const order = await createOrder(userId, lines);
    res.status(201).json({ order });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const order = await getOrder(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ order });
  } catch (err) { next(err); }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const order = await updateStatus(req.params.id, req.body.status as OrderStatus);
    res.json({ order });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const order = await cancelOrder(req.params.id);
    res.json({ order });
  } catch (err) { next(err); }
});

export default router;
