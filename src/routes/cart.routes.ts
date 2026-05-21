import { Router } from 'express';
import { getCart, addToCart, clearCart } from '../services/cart.service';

const router = Router();
router.get('/:userId', async (req, res, next) => { try { res.json({ cart: await getCart(req.params.userId) }); } catch(err){next(err);}});
router.post('/', async (req, res, next) => { try { const { userId, productId, quantity } = req.body; res.json({ cart: await addToCart(userId, productId, quantity) }); } catch(err){next(err);}});
router.delete('/:userId', async (req, res, next) => { try { await clearCart(req.params.userId); res.status(204).send(); } catch(err){next(err);}});

export default router;
