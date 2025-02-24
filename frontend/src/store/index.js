import { configureStore } from '@reduxjs/toolkit'
import interactionsReducer from './slices/interactionsSlice'
import tasksReducer from './slices/tasksSlice'
import merchantsReducer from './slices/merchantsSlice'
import usersReducer from './slices/usersSlice'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    interactions: interactionsReducer,
    tasks: tasksReducer,
    merchants: merchantsReducer,
    users: usersReducer,
    auth: authReducer,
  },
})

export default store 