import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../utils/axios'

const API_URL = 'http://localhost:5000/api/tasks'

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async ({ interactionId = null, assignedTo = null }) => {
    const params = new URLSearchParams()
    if (interactionId) params.append('interactionId', interactionId)
    if (assignedTo) params.append('assignedTo', assignedTo)
    
    const url = `${API_URL}?${params.toString()}`
    const response = await axios.get(url)
    return response.data
  }
)

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, taskData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create task')
    }
  }
)

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ taskId, status }) => {
    const response = await axios.patch(`${API_URL}/${taskId}`, { status })
    return response.data
  }
)

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete task')
    }
  }
)

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(createTask.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list.push(action.payload)
        state.error = null
      })
      .addCase(createTask.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex(task => task._id === action.payload._id)
        if (index !== -1) {
          state.list[index] = action.payload
        }
      })
      .addCase(deleteTask.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = state.list.filter(task => task._id !== action.payload)
        state.error = null
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export default tasksSlice.reducer 