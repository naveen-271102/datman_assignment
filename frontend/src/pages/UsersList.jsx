import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
} from '@mui/material'
import { fetchUsers } from '../store/slices/usersSlice'
import UserForm from '../components/users/UserForm'

const UsersList = () => {
  const dispatch = useDispatch()
  const [openUserForm, setOpenUserForm] = useState(false)
  const { list: users, status } = useSelector((state) => state.users)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Users & Agents</Typography>
        <Button 
          variant="contained" 
          onClick={() => setOpenUserForm(true)}
        >
          Add New User
        </Button>
      </Box>

      {status === 'loading' ? (
        <Typography>Loading...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      color={user.role === 'admin' ? 'error' : user.role === 'manager' ? 'warning' : 'primary'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.status || 'Active'} 
                      color={user.status === 'Inactive' ? 'default' : 'success'}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <UserForm
        open={openUserForm}
        onClose={() => setOpenUserForm(false)}
      />
    </Box>
  )
}

export default UsersList 