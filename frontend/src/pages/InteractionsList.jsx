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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { fetchInteractions, deleteInteraction } from '../store/slices/interactionsSlice'
import InteractionForm from '../components/interactions/InteractionForm'

const InteractionsList = () => {
  const dispatch = useDispatch()
  const [openInteractionForm, setOpenInteractionForm] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [interactionToDelete, setInteractionToDelete] = useState(null)
  const { list: interactions, status } = useSelector((state) => state.interactions)

  useEffect(() => {
    dispatch(fetchInteractions())
  }, [dispatch])

  const handleDeleteClick = (interaction) => {
    setInteractionToDelete(interaction)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteInteraction(interactionToDelete._id)).unwrap()
      toast.success('Interaction deleted successfully')
      setDeleteConfirmOpen(false)
      setInteractionToDelete(null)
    } catch (error) {
      toast.error('Failed to delete interaction')
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Interactions</Typography>
        <Button 
          variant="contained" 
          onClick={() => setOpenInteractionForm(true)}
        >
          New Interaction
        </Button>
      </Box>

      {status === 'loading' ? (
        <Typography>Loading...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Merchant</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Agent</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {interactions.map((interaction) => (
                <TableRow key={interaction._id}>
                  <TableCell>{interaction.merchantId?.name}</TableCell>
                  <TableCell>{interaction.type}</TableCell>
                  <TableCell>{interaction.notes}</TableCell>
                  <TableCell>{interaction.agentId?.name}</TableCell>
                  <TableCell>
                    {new Date(interaction.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(interaction)}
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

      <InteractionForm
        open={openInteractionForm}
        onClose={() => setOpenInteractionForm(false)}
      />

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this interaction with {interactionToDelete?.merchantId?.name}?
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

export default InteractionsList 