import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ToastContainer } from 'react-toastify'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'react-toastify/dist/ReactToastify.css'

// Layout Components
import Layout from './components/layout/Layout'
import PrivateRoute from './components/auth/PrivateRoute'

// Pages
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import MerchantList from './pages/MerchantList'
import MerchantDetails from './pages/MerchantDetails'
import InteractionsList from './pages/InteractionsList'
import TasksList from './pages/TasksList'
import UsersList from './pages/UsersList'

// Theme
import theme from './theme'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/merchants"
              element={
                <PrivateRoute>
                  <Layout>
                    <MerchantList />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/merchants/:id"
              element={
                <PrivateRoute>
                  <Layout>
                    <MerchantDetails />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/interactions"
              element={
                <PrivateRoute>
                  <Layout>
                    <InteractionsList />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <PrivateRoute>
                  <Layout>
                    <TasksList />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <Layout>
                    <UsersList />
                  </Layout>
                </PrivateRoute>
              }
            />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
