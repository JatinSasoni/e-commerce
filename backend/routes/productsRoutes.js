import express from 'express';
import { getAllCategory, getAllProducts, getProductById } from '../controllers/products.controller.js';

const router = express.Router();

// Get all products
router.get('/', getAllProducts);

// Get single product
router.get('/:id', getProductById);

// Get categories
router.get('/categories/all',getAllCategory);

export default router;