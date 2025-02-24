const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask
} = require('../controllers/tasks')

// All routes require authentication
router.use(protect)

router.route('/')
  .get(getTasks)
  .post(createTask)

router.route('/:id')
  .delete(deleteTask)
  .patch(updateTaskStatus)

module.exports = router 