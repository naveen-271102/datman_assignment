import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Card,
  CardContent,
  Divider,
  Chip,
} from '@mui/material'
import {
  Timeline,
  Business,
  Assignment,
  CheckCircle,
  Pending,
  Warning,
} from '@mui/icons-material'
import { fetchTasks } from '../store/slices/tasksSlice'
import { fetchInteractions } from '../store/slices/interactionsSlice'
import { fetchMerchants } from '../store/slices/merchantsSlice'

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { list: tasks } = useSelector((state) => state.tasks)
  const { list: interactions } = useSelector((state) => state.interactions)
  const { list: merchants } = useSelector((state) => state.merchants)

  useEffect(() => {
    dispatch(fetchTasks({}))
    dispatch(fetchInteractions())
    dispatch(fetchMerchants())
  }, [dispatch])

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle color="success" />
      case 'In Progress':
        return <Warning color="warning" />
      default:
        return <Pending color="action" />
    }
  }

  // Calculate statistics
  const stats = {
    totalMerchants: merchants.length,
    activeMerchants: merchants.filter(m => m.status === 'Active').length,
    pendingTasks: tasks.filter(t => t.status === 'Pending').length,
    completedTasks: tasks.filter(t => t.status === 'Completed').length,
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Business sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5">{stats.totalMerchants}</Typography>
              <Typography color="textSecondary">Total Merchants</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 2 }} />
              <Typography variant="h5">{stats.activeMerchants}</Typography>
              <Typography color="textSecondary">Active Merchants</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Assignment sx={{ fontSize: 40, color: 'warning.main', mb: 2 }} />
              <Typography variant="h5">{stats.pendingTasks}</Typography>
              <Typography color="textSecondary">Pending Tasks</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Timeline sx={{ fontSize: 40, color: 'info.main', mb: 2 }} />
              <Typography variant="h5">{interactions.length}</Typography>
              <Typography color="textSecondary">Total Interactions</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activities */}
      <Grid container spacing={3}>
        {/* Recent Tasks */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Tasks</Typography>
              <Button onClick={() => navigate('/tasks')} color="primary">
                View All
              </Button>
            </Box>
            <List>
              {tasks.slice(0, 5).map((task) => (
                <Box key={task._id}>
                  <ListItem>
                    <ListItemText
                      primary={task.description}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            Due: {new Date(task.reminderDateTime).toLocaleDateString()}
                          </Typography>
                          <br />
                          <Chip
                            size="small"
                            label={task.status}
                            color={getStatusColor(task.status)}
                            icon={getStatusIcon(task.status)}
                          />
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

        {/* Recent Interactions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Interactions</Typography>
              <Button onClick={() => navigate('/interactions')} color="primary">
                View All
              </Button>
            </Box>
            <List>
              {interactions.slice(0, 5).map((interaction) => (
                <Box key={interaction._id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <>
                          {interaction.merchantId?.name} - {interaction.type}
                        </>
                      }
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
      </Grid>
    </Box>
  )
}

export default Dashboard 