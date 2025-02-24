import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  Typography,
  CircularProgress,
} from '@mui/material'
import { createMerchant } from '../../store/slices/merchantsSlice'

const MerchantForm = ({ open, onClose }) => {
  const dispatch = useDispatch()
  const [error, setError] = useState(null)
  const { status } = useSelector((state) => state.merchants)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Active',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    try {
      await dispatch(createMerchant(formData)).unwrap()
      handleClose()
    } catch (error) {
      setError(error)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      status: 'Active',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
    })
    setError(null)
    onClose()
  }

  const handleAddressChange = (field, value) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [field]: value,
      },
    })
  }

  const isLoading = status === 'loading'

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Merchant</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              fullWidth
              disabled={isLoading}
            />

            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              fullWidth
              disabled={isLoading}
            />

            <TextField
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              fullWidth
              disabled={isLoading}
            />

            <FormControl fullWidth disabled={isLoading}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>Address</Typography>

            <TextField
              label="Street"
              value={formData.address.street}
              onChange={(e) => handleAddressChange('street', e.target.value)}
              fullWidth
              disabled={isLoading}
            />

            <TextField
              label="City"
              value={formData.address.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              fullWidth
              disabled={isLoading}
            />

            <TextField
              label="State"
              value={formData.address.state}
              onChange={(e) => handleAddressChange('state', e.target.value)}
              fullWidth
              disabled={isLoading}
            />

            <TextField
              label="Zip Code"
              value={formData.address.zipCode}
              onChange={(e) => handleAddressChange('zipCode', e.target.value)}
              fullWidth
              disabled={isLoading}
            />

            <TextField
              label="Country"
              value={formData.address.country}
              onChange={(e) => handleAddressChange('country', e.target.value)}
              fullWidth
              disabled={isLoading}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default MerchantForm 