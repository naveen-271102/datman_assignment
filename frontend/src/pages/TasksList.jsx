import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { 
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon 
} from '@mui/icons-material'
import { fetchTasks, updateTaskStatus, deleteTask } from '../store/slices/tasksSlice'
import { fetchMerchants } from '../store/slices/merchantsSlice'
import { fetchUsers } from '../store/slices/usersSlice'
import TaskForm from '../components/tasks/TaskForm'

const TasksList = () => {
  const dispatch = useDispatch()
  const [openTaskForm, setOpenTaskForm] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const { list: tasks, status } = useSelector((state) => state.tasks)
  const { list: merchants } = useSelector((state) => state.merchants)

  useEffect(() => {
    dispatch(fetchTasks({}))
    dispatch(fetchMerchants())
    dispatch(fetchUsers())
  }, [dispatch])

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await dispatch(updateTaskStatus({ taskId, status: newStatus })).unwrap()
      setAnchorEl(null)
    } catch (error) {
      console.error('Failed to update task status:', error)
    }
  }

  const handleMenuClick = (event, task) => {
    setAnchorEl(event.currentTarget)
    setSelectedTask(task)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedTask(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success'
      case 'In Progress':
        return 'warning'
      default:
        return 'default'
    }
  }

  const handleDeleteClick = (task) => {
    setTaskToDelete(task)
    setDeleteConfirmOpen(true)
    setAnchorEl(null)
  }

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteTask(taskToDelete._id)).unwrap()
      toast.success('Task deleted successfully')
      setDeleteConfirmOpen(false)
      setTaskToDelete(null)
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Tasks</Typography>
        <Button 
          variant="contained" 
          onClick={() => setOpenTaskForm(true)}
        >
          New Task
        </Button>
      </Box>

      {status === 'loading' ? (
        <Typography>Loading...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Related Interaction</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.assignedTo?.name}</TableCell>
                  <TableCell>
                    {task.reminderDateTime && 
                      new Date(task.reminderDateTime).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={task.status} 
                      color={getStatusColor(task.status)}
                    />
                  </TableCell>
                  <TableCell>
                    {task.interactionId?.merchantId?.name} - {task.interactionId?.type}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuClick(e, task)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleStatusChange(selectedTask?._id, 'Pending')}>
          Set to Pending
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange(selectedTask?._id, 'In Progress')}>
          Set to In Progress
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange(selectedTask?._id, 'Completed')}>
          Set to Completed
        </MenuItem>
        <MenuItem 
          onClick={() => handleDeleteClick(selectedTask)}
          sx={{ color: 'error.main' }}
        >
          Delete Task
        </MenuItem>
      </Menu>

      <TaskForm
        open={openTaskForm}
        onClose={() => setOpenTaskForm(false)}
        merchants={merchants}
      />

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this task?
          {taskToDelete?.description && (
            <Typography sx={{ mt: 1, fontStyle: 'italic' }}>
              "{taskToDelete.description}"
            </Typography>
          )}
          This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default TasksList 