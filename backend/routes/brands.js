const express = require('express');
const router = express.Router();
const { 
  getBrands, 
  getBrand, 
  createBrand, 
  updateBrand, 
  deleteBrand 
} = require('../controllers/brands');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getBrands);

router.get('/:id', getBrand);

router.post('/', protect, authorize('admin'), createBrand);

router.put('/:id', protect, authorize('admin'), updateBrand);

router.delete('/:id', protect, authorize('admin'), deleteBrand);

module.exports = router; 