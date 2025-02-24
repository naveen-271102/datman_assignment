const User = require('../models/User')
const jwt = require('jsonwebtoken')

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

// Register new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // Check if user exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'agent'  // Default to agent if no role specified
    })

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check for user email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.json(user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Get all users
exports.getUsers = async (req, res) => {
  try {
    // Only return necessary fields for task assignment
    const users = await User.find().select('name email role')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.name = name || user.name
    user.email = email || user.email
    if (role && req.user.role === 'admin') {
      user.role = role
    }

    const updatedUser = await user.save()
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
} 