import { Grid, IconButton, ListItemButton, ListItemIcon, Paper, Typography } from '@mui/material'
import React from 'react'
import { MenuLateral } from '../../componentes/MenuLateral/MenuLateral'
import MenuIcon from '@mui/icons-material/Menu';
import { TipoPantalla } from '../../utilidades/ControlPantalla';

export const InicioPagina = () => {
  const tipoPantalla = TipoPantalla()
  return (
    <>
      <MenuLateral>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          className='fondoImagenLogin'
          sx={{
            minHeight: '85vh', // altura completa
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4c21e6ff',
            padding: 2
          }}>
          <Grid item xs={12} md={8} sx={{ textAlign: 'center' }}>

            {/* Logo sin recuadro */}
            {/*  <Box sx={{ mb: 3 }}>
            <img
              src={`${process.env.PUBLIC_URL}/logo192.png`}
              alt="Logo Arigasol"
              style={{ maxWidth: '150px', height: 'auto' }}
            />
          </Box> */}

            <Typography variant='h3' gutterBottom>Ariges Informes</Typography>
            <Typography sx={{ maxWidth: 700, margin: '0 auto' }} variant='h6'>
              Bienvenido a la aplicación. Para acceder a las diferentes funciones puede hacer uso del menú lateral.
            </Typography>
          </Grid>
        </Grid>
      </MenuLateral>
    </>

  )
}
