const Merchant = require('../models/Merchant')

// Get all merchants
exports.getMerchants = async (req, res) => {
  try {
    const merchants = await Merchant.find()
    res.json(merchants)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get single merchant by ID
exports.getMerchantById = async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.id)
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' })
    }
    res.json(merchant)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create new merchant
exports.createMerchant = async (req, res) => {
  try {
    const merchant = await Merchant.create({
      ...req.body,
      createdBy: req.user._id
    })
    res.status(201).json(merchant)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Update merchant
exports.updateMerchant = async (req, res) => {
  try {
    const merchant = await Merchant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' })
    }
    res.json(merchant)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Delete merchant
exports.deleteMerchant = async (req, res) => {
  try {
    const merchant = await Merchant.findByIdAndDelete(req.params.id)
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' })
    }
    res.json({ message: 'Merchant deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
} 