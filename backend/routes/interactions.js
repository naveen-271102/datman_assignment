const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const { 
  createInteraction, 
  getInteractions,
  deleteInteraction
} = require('../controllers/interactions')

router.use(protect)

router.route('/')
  .post(createInteraction)
  .get(getInteractions)

router.route('/:id')
  .delete(deleteInteraction)

module.exports = router 