import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import './LoginPagina.css'

export const LoginCabecera = () => {
    return (
        <Box>
            <Grid container spacing={1}>
                <Grid item xs={2}>
                    <img src="https://tdinf-uploads.s3.eu-west-1.amazonaws.com/ariadna/Ariadna_140.png" alt="logo" className='imagenLogo'/>
                </Grid>
                <Grid item xs={10} className='cololetra'>
                    <Typography variant='h6' component='h6'>
                        AriAgroWeb
                    </Typography>
                    <Typography variant='subtitle2'>
                        (C) Ariadna Software SL (2024)
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    )
}