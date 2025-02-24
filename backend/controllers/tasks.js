const Task = require('../models/Task')
const Interaction = require('../models/Interaction')

// Get tasks
exports.getTasks = async (req, res) => {
  try {
    const { interactionId, assignedTo } = req.query
    const query = {}
    
    if (interactionId) query.interactionId = interactionId
    if (assignedTo) query.assignedTo = assignedTo

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name')
      .populate('assignedBy', 'name')
      .populate({
        path: 'interactionId',
        populate: { path: 'merchantId', select: 'name' }
      })
      .sort('-createdAt')

    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create task
exports.createTask = async (req, res) => {
  try {
    const { interactionId, description, assignedTo, reminderDateTime } = req.body

    // Verify interaction exists
    const interaction = await Interaction.findById(interactionId)
    if (!interaction) {
      return res.status(404).json({ message: 'Interaction not found' })
    }

    const task = await Task.create({
      interactionId,
      description,
      assignedTo,
      assignedBy: req.user._id,
      reminderDateTime,
      createdBy: req.user._id
    })

    // Populate references
    await task.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'interactionId', populate: { path: 'merchantId', select: 'name' } }
    ])

    res.status(201).json(task)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Update task status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    task.status = status
    task.updatedAt = Date.now()
    await task.save()

    res.json(task)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    await task.deleteOne()
    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
} 