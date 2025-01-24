'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import Link from 'next/link';


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

  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(0);
  const [sortOrder, setSortOrder] = useState('asc');   //controlls the sort-by button (asc or des)
  const [sortCriterion, setSortCriterion] = useState('Item');


  const updateInventory = async () => {
    await fetch('http://localhost:3080')
      .then( response => response.json() )
      .then( data => {
        console.log("Data from backend:", data)
        setPantry(data) 
      });
  }

  
  useEffect(() => {
    updateInventory();
    console.log("Updated pantry:", pantry);
  }, [])


  const addItem = async (item, category, amount) => {

    await fetch('http://localhost:3080/add-item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Item: item, Category: category, Amount: amount}),
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

  const handleSort = (sortCriterion) => {
    const sortedPantry = [...pantry].sort((a, b) => {
      if (sortCriterion === 'Item') {
        if (a.Item < b.Item) return sortOrder === 'asc' ? -1 : 1
        if (a.Item > b.Item) return sortOrder === 'asc' ? 1 : -1
        if (a.Amount < b.Amount) return sortOrder === 'asc' ? -1 : 1
        if (a.Amount > b.Amount) return sortOrder === 'asc' ? 1 : -1
        return 0
      } else if (sortCriterion === 'Amount') {
        if (a.Amount < b.Amount) return sortOrder === 'asc' ? -1 : 1
        if (a.Amount > b.Amount) return sortOrder === 'asc' ? 1 : -1
        if (a.Item < b.Item) return -1
        if (a.Item > b.Item) return 1
        return 0
      }
    })
    setPantry(sortedPantry)
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    setSortCriterion(sortCriterion)
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
            <TextField
              id="outlined-basic"
              label="Category"
              variant="outlined"
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Amount"
              variant="outlined"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName, category, amount)
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
      <Button variant="contained" onClick={() => handleSort('Item')}>
        Sort by Name ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
      </Button>
      <Button variant="contained" onClick={() => handleSort('Amount')}>
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
              <Link href={`/${Item}`} style={{ textDecoration: 'none' }}>
                <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                  {Item.charAt(0).toUpperCase() + Item.slice(1)}
                </Typography>
              </Link>
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
