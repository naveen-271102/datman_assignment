import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import { fetchMerchantById } from '../store/slices/merchantsSlice'
import { fetchInteractions } from '../store/slices/interactionsSlice'
import { fetchTasks, updateTaskStatus } from '../store/slices/tasksSlice'
import InteractionForm from '../components/interactions/InteractionForm'

const MerchantDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [openInteractionForm, setOpenInteractionForm] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const { selectedMerchant } = useSelector((state) => state.merchants)
  const { list: interactions } = useSelector((state) => state.interactions)
  const { list: tasks } = useSelector((state) => state.tasks)

  useEffect(() => {
    if (id) {
      dispatch(fetchMerchantById(id))
      dispatch(fetchInteractions(id))
      dispatch(fetchTasks({ merchantId: id }))
    }
  }, [dispatch, id])

  const handleStatusClick = (event, task) => {
    setAnchorEl(event.currentTarget)
    setSelectedTask(task)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedTask(null)
  }

  const handleStatusChange = async (newStatus) => {
    try {
      await dispatch(updateTaskStatus({ taskId: selectedTask._id, status: newStatus })).unwrap()
      toast.success('Task status updated successfully')
      handleMenuClose()
    } catch (error) {
      toast.error('Failed to update task status')
      console.error('Failed to update task status:', error)
    }
  }

  if (!selectedMerchant) {
    return <Typography>Loading...</Typography>
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">{selectedMerchant.name}</Typography>
        <Button variant="contained" onClick={() => setOpenInteractionForm(true)}>
          New Interaction
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Merchant Information
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography>Email: {selectedMerchant.email}</Typography>
              <Typography>Phone: {selectedMerchant.phone}</Typography>
              <Typography>Status: {selectedMerchant.status}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Address
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography>{selectedMerchant.address?.street}</Typography>
              <Typography>
                {selectedMerchant.address?.city}, {selectedMerchant.address?.state}
              </Typography>
              <Typography>{selectedMerchant.address?.zipCode}</Typography>
              <Typography>{selectedMerchant.address?.country}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Interactions
            </Typography>
            <List>
              {interactions.map((interaction) => (
                <Box key={interaction._id}>
                  <ListItem>
                    <ListItemText
                      primary={interaction.type}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            {new Date(interaction.createdAt).toLocaleString()}
                          </Typography>
                          <br />
                          {interaction.notes}
                        </>
                      }
                    />
                  </ListItem>
                  <Divider />
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tasks
            </Typography>
            <List>
              {tasks.map((task) => (
                <Box key={task._id}>
                  <ListItem>
                    <ListItemText
                      primary={task.description}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            Status: {task.status}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            Assigned to: {task.assignedTo?.name}
                          </Typography>
                          {task.reminderDateTime && (
                            <>
                              <br />
                              <Typography component="span" variant="body2">
                                Due: {new Date(task.reminderDateTime).toLocaleString()}
                              </Typography>
                            </>
                          )}
                        </>
                      }
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={(e) => handleStatusClick(e, task)}
                    >
                      Update Status
                    </Button>
                  </ListItem>
                  <Divider />
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleStatusChange('Pending')}>
          Set to Pending
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('In Progress')}>
          Set to In Progress
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('Completed')}>
          Set to Completed
        </MenuItem>
      </Menu>

      <InteractionForm
        open={openInteractionForm}
        onClose={() => setOpenInteractionForm(false)}
        merchantId={id}
      />
    </Box>
  )
}

export default MerchantDetails 