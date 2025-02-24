const express = require('express')
const router = express.Router()
const { protect, authorize } = require('../middleware/auth')
const {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  updateUser
} = require('../controllers/users')

// Public routes
router.post('/register', registerUser)
router.post('/login', loginUser)

// Protected routes
router.use(protect)
router.get('/me', getMe)
router.get('/', getUsers)

// Admin only routes
router.use(authorize('admin', 'manager'))
router.route('/:id')
  .put(updateUser)

module.exports = router 