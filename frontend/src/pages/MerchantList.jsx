import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { fetchMerchants, deleteMerchant } from '../store/slices/merchantsSlice'
import MerchantForm from '../components/merchants/MerchantForm'

const MerchantList = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [openMerchantForm, setOpenMerchantForm] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [merchantToDelete, setMerchantToDelete] = useState(null)
  const { list: merchants, status } = useSelector((state) => state.merchants)

  useEffect(() => {
    dispatch(fetchMerchants())
  }, [dispatch])

  const filteredMerchants = merchants.filter((merchant) =>
    merchant.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteClick = (merchant) => {
    setMerchantToDelete(merchant)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteMerchant(merchantToDelete._id)).unwrap()
      toast.success('Merchant deleted successfully')
      setDeleteConfirmOpen(false)
      setMerchantToDelete(null)
    } catch (error) {
      toast.error('Failed to delete merchant')
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Merchants</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search merchants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenMerchantForm(true)}
          >
            Add Merchant
          </Button>
        </Box>
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
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMerchants.map((merchant) => (
                <TableRow key={merchant._id}>
                  <TableCell>{merchant.name}</TableCell>
                  <TableCell>{merchant.email}</TableCell>
                  <TableCell>{merchant.phone}</TableCell>
                  <TableCell>{merchant.status}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/merchants/${merchant._id}`)}
                      >
                        View Details
                      </Button>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(merchant)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <MerchantForm
        open={openMerchantForm}
        onClose={() => setOpenMerchantForm(false)}
      />

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {merchantToDelete?.name}? This action cannot be undone.
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

export default MerchantList 