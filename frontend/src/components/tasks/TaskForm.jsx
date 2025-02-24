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
  Alert,
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { createTask } from '../../store/slices/tasksSlice'
import { fetchInteractions } from '../../store/slices/interactionsSlice'
import { fetchUsers } from '../../store/slices/usersSlice'

const TaskForm = ({ open, onClose, merchants, interactionId = null, selectedMerchant = '' }) => {
  const dispatch = useDispatch()
  const [error, setError] = useState(null)
  const { list: users } = useSelector((state) => state.users)
  const { list: interactions } = useSelector((state) => state.interactions)
  const [localSelectedMerchant, setLocalSelectedMerchant] = useState(selectedMerchant)
  
  const [formData, setFormData] = useState({
    description: '',
    assignedTo: '',
    interactionId: interactionId || '',
    reminderDateTime: dayjs(),
    notes: ''
  })

  useEffect(() => {
    if (localSelectedMerchant) {
      dispatch(fetchInteractions(localSelectedMerchant))
    }
    dispatch(fetchUsers())
  }, [localSelectedMerchant, dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    if (!formData.assignedTo) {
      setError('Please select an agent to assign the task')
      return
    }

    try {
      await dispatch(createTask(formData)).unwrap()
      toast.success('Task created successfully!')
      onClose()
      setFormData({
        description: '',
        assignedTo: '',
        interactionId: '',
        reminderDateTime: dayjs(),
        notes: ''
      })
      setLocalSelectedMerchant('')
    } catch (error) {
      const errorMsg = typeof error === 'string' ? error : 'Failed to create task'
      setError(errorMsg)
      toast.error(errorMsg)
      console.error('Task creation error:', error)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Task</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}

            {!interactionId && (
              <>
                <FormControl fullWidth>
                  <InputLabel>Merchant</InputLabel>
                  <Select
                    value={localSelectedMerchant}
                    label="Merchant"
                    onChange={(e) => setLocalSelectedMerchant(e.target.value)}
                  >
                    {merchants?.map((merchant) => (
                      <MenuItem key={merchant._id} value={merchant._id}>
                        {merchant.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Related Interaction</InputLabel>
                  <Select
                    value={formData.interactionId}
                    label="Related Interaction"
                    onChange={(e) => setFormData({ ...formData, interactionId: e.target.value })}
                    disabled={!localSelectedMerchant}
                  >
                    {interactions
                      .filter(interaction => interaction.merchantId?._id === localSelectedMerchant)
                      .map((interaction) => (
                        <MenuItem key={interaction._id} value={interaction._id}>
                          {interaction.type} - {new Date(interaction.createdAt).toLocaleDateString()}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </>
            )}

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              fullWidth
            />

            <FormControl fullWidth required>
              <InputLabel>Assign Task To Agent</InputLabel>
              <Select
                value={formData.assignedTo}
                label="Assign Task To Agent"
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              >
                {users?.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name} ({user.role})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <DateTimePicker
              label="Reminder Date & Time"
              value={formData.reminderDateTime}
              onChange={(newValue) => setFormData({ ...formData, reminderDateTime: newValue })}
              slotProps={{ textField: { fullWidth: true } }}
              minDateTime={dayjs()}
            />

            <TextField
              label="Notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Create Task
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default TaskForm 