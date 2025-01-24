'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';


export default function Item({ params }){
    //console.log("params: ", params);
    const {item } = params;
    //console.log("item: ", item);

    const [itemDetails, setItemDetails] = useState(null);
    
    const updateItemDetail = async (item) => {
        await fetch(`http://localhost:3080/item-details?item=${item}`)
            .then( response => {
                console.log("response from backend: ", response);
                return response.json();               
            })
            .then( data => {
                console.log("data: ", data);
                setItemDetails(data);
            }) 
    }
    useEffect(() => {
        updateItemDetail(item);
        console.log("updated item details: ", itemDetails)
    }, [])

    if (!itemDetails) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="100vw"
                height="100vh"
            >
                <Typography>Loading...</Typography>
            </Box>
    );}

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
            {itemDetails.map(({ID,Item,Category,Amount}) => (
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
                        {Item}
                    </Typography>
                </Box>
            ))}

        </Box>
    )
}