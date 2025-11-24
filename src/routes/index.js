
import express from 'express';
import auth from '../routes/auth.routes.js';
import categories from '../routes/category.routes.js';
import products from '../routes/product.routes.js';
import cart from '../routes/cart.routes.js';
import order from '../routes/order.routes.js';

const router = express.Router();

router.use('/auth', auth);
router.use('/categories', categories);
router.use('/products', products);
router.use('/cart', cart);
router.use('/orders', order);

export default router;
