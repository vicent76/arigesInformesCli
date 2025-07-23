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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper variant='outlined' sx={tipoPantalla === 'mobile' ? { padding: 2 } : { padding: 10 }}>
              <Typography variant='h3'> AriAgro Web </Typography>
              <Typography>
                Bienvenido a la aplicación. Para acceder a las diferentes funciones puede hacer uso del menú de parte lateral. Intentando conseguir el
                máximo espacio de trabajo, ese menú está oculto por defecto, puede desplegarlo y ocultarlo haciendo clic en el icono <IconButton><MenuIcon /></IconButton> de la parte superior izquierda
                de la barra de tareas.

              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </MenuLateral>
    </>

  )
}
