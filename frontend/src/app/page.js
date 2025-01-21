'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'


const item = [
  'tomato',
  'patato',
  'ginger',
]

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}



export default function Home() {

  const [pantry, setPantry] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [sortCriterion, setSortCriterion] = useState('name')


  const updateInventory = async () => {
    await fetch('http://localhost:3080')
      .then( response => response.json() )
      .then( data => {
        console.log("Data from backend:", data)
        setPantry(data) 
      });
  }

  
  useEffect(() => {
    console.log("Updated pantry:", pantry);
    updateInventory( response => response.json() );
  }, [])


  const addItem = async (item) => {

    await fetch('http://localhost:3080/add-item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Item: item}),
    }).then( response => response.json() )
      .then( data => {
        console.log("Data from backend:", data)
      });
    await updateInventory() 
  }
  
  const removeItem = async (item) => {
    await fetch('http://localhost:3080/remove-item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Item: item}),
    }).then( response => response.json() )
      .then( data => {
        console.log("Data from backend:", data)
      });
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSort = (criterion) => {
    const sortedPantry = [...pantry].sort((a, b) => {
      if (criterion === 'name') {
        if (a.name < b.name) return sortOrder === 'asc' ? -1 : 1
        if (a.name > b.name) return sortOrder === 'asc' ? 1 : -1
        return 0
      } else if (criterion === 'quantity') {
        if (a.quantity < b.quantity) return sortOrder === 'asc' ? -1 : 1
        if (a.quantity > b.quantity) return sortOrder === 'asc' ? 1 : -1
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
      }
    })
    setPantry(sortedPantry)
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    setSortCriterion(criterion)
  }


  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
            Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <Button variant="contained" onClick={() => handleSort('name')}>
        Sort by Name ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
      </Button>
      <Button variant="contained" onClick={() => handleSort('quantity')}>
        Sort by Quantity ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
      </Button>
      <Box border={'1px solid #333'}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>Inventory Management</Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {/* {item.map((i)=>(
            <Box 
              key={i} 
              width="100%"
              minHeight="150px"
              display={'flex'}
              // justifyContent={'space-between'}
              justifyContent={'center'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              {i}
            </Box>
          ))} */}

          
          {pantry.map(({ID, Item, Category, Amount})=>(
            <Box 
              key={Item} 
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >

              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                {Item.charAt(0).toUpperCase() + Item.slice(1)}
              </Typography>
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                Quantity: {Amount}
              </Typography>
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                Category: {Category}
              </Typography>
              <Button variant="contained" onClick={() => removeItem(Item)}>
                Remove
              </Button>
            </Box>
           ))}
        </Stack>
      </Box>
    </Box> 
  )
}
