import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../utils/axios'

const API_URL = '/interactions'

export const fetchInteractions = createAsyncThunk(
  'interactions/fetchInteractions',
  async (merchantId = null) => {
    const url = merchantId ? `${API_URL}?merchantId=${merchantId}` : API_URL
    const response = await axios.get(url)
    return response.data
  }
)

export const createInteraction = createAsyncThunk(
  'interactions/createInteraction',
  async (interactionData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, interactionData)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create interaction'
      )
    }
  }
)

export const deleteInteraction = createAsyncThunk(
  'interactions/deleteInteraction',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete interaction')
    }
  }
)

const interactionsSlice = createSlice({
  name: 'interactions',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInteractions.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = action.payload
      })
      .addCase(fetchInteractions.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(createInteraction.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(createInteraction.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list.push(action.payload)
        state.error = null
      })
      .addCase(createInteraction.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(deleteInteraction.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteInteraction.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = state.list.filter(interaction => interaction._id !== action.payload)
        state.error = null
      })
      .addCase(deleteInteraction.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export default interactionsSlice.reducer 