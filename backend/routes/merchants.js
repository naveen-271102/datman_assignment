const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const {
  getMerchants,
  getMerchantById,
  createMerchant,
  updateMerchant,
  deleteMerchant
} = require('../controllers/merchants')

router.use(protect)

router.route('/')
  .get(getMerchants)
  .post(createMerchant)

router.route('/:id')
  .get(getMerchantById)
  .put(updateMerchant)
  .delete(deleteMerchant)

module.exports = router 