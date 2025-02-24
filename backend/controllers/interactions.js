const Interaction = require('../models/Interaction')
const Merchant = require('../models/Merchant')

exports.createInteraction = async (req, res) => {
  try {
    const interaction = await Interaction.create({
      ...req.body,
      agentId: req.user._id // Add the current user as the agent
    })

    // Populate the merchant details
    await interaction.populate('merchantId')
    
    res.status(201).json(interaction)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.getInteractions = async (req, res) => {
  try {
    const { merchantId } = req.query
    const query = merchantId ? { merchantId } : {}
    
    const interactions = await Interaction.find(query)
      .populate('merchantId', 'name email')
      .populate('agentId', 'name')
      .sort('-createdAt')

    res.json(interactions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deleteInteraction = async (req, res) => {
  try {
    const interaction = await Interaction.findById(req.params.id)
    
    if (!interaction) {
      return res.status(404).json({ message: 'Interaction not found' })
    }

    await interaction.deleteOne()
    res.json({ message: 'Interaction deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
} 