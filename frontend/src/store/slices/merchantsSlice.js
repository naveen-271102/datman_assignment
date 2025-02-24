import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../utils/axios'

const API_URL = '/merchants'

export const fetchMerchants = createAsyncThunk(
  'merchants/fetchMerchants',
  async () => {
    const response = await axios.get(API_URL)
    return response.data
  }
)

export const fetchMerchantById = createAsyncThunk(
  'merchants/fetchMerchantById',
  async (id) => {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data
  }
)

export const createMerchant = createAsyncThunk(
  'merchants/createMerchant',
  async (merchantData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, merchantData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create merchant')
    }
  }
)

export const deleteMerchant = createAsyncThunk(
  'merchants/deleteMerchant',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete merchant')
    }
  }
)

const merchantsSlice = createSlice({
  name: 'merchants',
  initialState: {
    list: [],
    selectedMerchant: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMerchants.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchMerchants.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = action.payload
      })
      .addCase(fetchMerchants.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(fetchMerchantById.fulfilled, (state, action) => {
        state.selectedMerchant = action.payload
      })
      .addCase(createMerchant.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(createMerchant.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list.push(action.payload)
        state.error = null
      })
      .addCase(createMerchant.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(deleteMerchant.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteMerchant.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = state.list.filter(merchant => merchant._id !== action.payload)
        state.error = null
      })
      .addCase(deleteMerchant.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export default merchantsSlice.reducer 