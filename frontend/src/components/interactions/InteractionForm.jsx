import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
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
  Checkbox,
  FormControlLabel,
  Alert,
  Typography,
} from '@mui/material'
import { createInteraction } from '../../store/slices/interactionsSlice'
import { fetchMerchants } from '../../store/slices/merchantsSlice'
import TaskForm from '../tasks/TaskForm'

const InteractionForm = ({ open, onClose }) => {
  const dispatch = useDispatch()
  const [errorMessage, setErrorMessage] = useState('')
  const [createTask, setCreateTask] = useState(false)
  const [interactionId, setInteractionId] = useState(null)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const { list: merchants } = useSelector((state) => state.merchants)
  
  const [formData, setFormData] = useState({
    merchantId: '',
    type: '',
    notes: '',
  })

  useEffect(() => {
    if (open) {
      dispatch(fetchMerchants())
    }
  }, [dispatch, open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    
    if (!formData.merchantId) {
      setErrorMessage('Please select a merchant')
      return
    }
    
    try {
      const result = await dispatch(createInteraction(formData)).unwrap()
      toast.success('Interaction created successfully!')
      if (createTask) {
        setInteractionId(result._id)
        setShowTaskForm(true)
      } else {
        handleClose()
      }
    } catch (error) {
      setErrorMessage(typeof error === 'string' ? error : 'Failed to create interaction')
      toast.error('Failed to create interaction')
      console.error('Interaction creation error:', error)
    }
  }

  const handleClose = () => {
    setFormData({
      merchantId: '',
      type: '',
      notes: '',
    })
    setCreateTask(false)
    setErrorMessage('')
    onClose()
  }

  const handleTaskFormClose = () => {
    setShowTaskForm(false)
    handleClose()
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>New Interaction</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

              <FormControl fullWidth required>
                <InputLabel id="merchant-select-label">Merchant</InputLabel>
                <Select
                  labelId="merchant-select-label"
                  value={formData.merchantId}
                  label="Merchant"
                  onChange={(e) => setFormData({ ...formData, merchantId: e.target.value })}
                >
                  {merchants?.map((merchant) => (
                    <MenuItem key={merchant._id} value={merchant._id}>
                      {merchant.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Type"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <MenuItem value="Phone">Phone</MenuItem>
                  <MenuItem value="Email">Email</MenuItem>
                  <MenuItem value="Chat">Chat</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Notes"
                multiline
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                required
                fullWidth
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={createTask}
                    onChange={(e) => setCreateTask(e.target.checked)}
                  />
                }
                label="Create a task for this interaction"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {showTaskForm && (
        <TaskForm
          open={showTaskForm}
          onClose={handleTaskFormClose}
          merchants={merchants}
          interactionId={interactionId}
          selectedMerchant={formData.merchantId}
        />
      )}
    </>
  )
}

export default InteractionForm 