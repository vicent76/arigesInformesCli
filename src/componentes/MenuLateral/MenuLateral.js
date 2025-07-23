import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import {  Grid, IconButton, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {  Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import { GeneralCtx } from '../../contextos/GeneralContext'
import { leerVersion } from '../../servicios/ApiLib';
import { TipoPantalla } from '../../utilidades/ControlPantalla';

//
import BarChartIcon from '@mui/icons-material/BarChart';

const drawerWidth = 230;

export const MenuLateral = (props) => {
    const navigate = useNavigate()

    const { getSession } = useContext(GeneralCtx)
    const [sesion, setSesion] = useState()
    const [drVariant, setDrVariant] = useState('temporary')
    const [drOpen, setDrOpen] = useState(false)
    const [version, setVersion] = useState('0.0.0')
    const [tipoPantalla, setTipoPantalla] = useState('desktop')
    let session = {}
    const handleDrOpen = () => {
        if (drOpen) {
            // ya está abierto y lo cerramos
            setDrVariant('temporary')
            setDrOpen(false)
        } else {
            // no está abierto, lo abrimos
            setDrVariant('permanent')
            setDrOpen(true)
        }
    }

    const handleClose = () => {
        navigate('/')
    }

    const consultarVersion = async () => {
        const { data: versionData } = await leerVersion()
        setVersion(versionData.version)
    }

    useEffect(() => {
        // Comprobación de que hay una sesión activa
        session = getSession()
        if (!session) navigate('/')
        setSesion(session)
        consultarVersion()
        setTipoPantalla(TipoPantalla())
    }, [])

    return (
        <div>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Grid container>
                    <Grid item xs={12}>
                        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                            <Toolbar>
                                <IconButton
                                    size="large"
                                    edge="start"
                                    color="inherit"
                                    aria-label="menu"
                                    sx={{ mr: 2 }}
                                    onClick={handleDrOpen}
                                >
                                    <MenuIcon />
                                </IconButton>
                                {tipoPantalla === 'mobile' ?
                                    ''
                                    :
                                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                        AriAgroWeb  VRS: {version}
                                    </Typography>
                                }

                                <IconButton
                                    size="large"
                                    edge="start"
                                    color="inherit"
                                    aria-label="menu"
                                >
                                    <PersonIcon />
                                    <Typography ml={1}>{sesion ? sesion.usuario.nomusu : ''}</Typography>
                                </IconButton>
                                <IconButton
                                    size="large"
                                    edge="start"
                                    color="inherit"
                                    aria-label="menu"
                                    onClick={handleClose}
                                >
                                    <ExitToAppIcon />
                                </IconButton>
                            </Toolbar>
                        </AppBar>
                        <Drawer
                            variant={drVariant}
                            sx={{
                                width: drawerWidth,
                                flexShrink: 0,
                                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                            }}
                            open={drOpen}
                        >
                            <Toolbar />
                            <Box sx={{ overflow: 'auto' }}>
                                <List>
                                    <ListItem key='Inicio' disablePadding onClick={() => { navigate('/inicio') }}>
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <Home />
                                            </ListItemIcon>
                                            <ListItemText> Inicio </ListItemText>
                                        </ListItemButton>
                                    </ListItem>
                                </List>

                                <ListItem key='Comparativa' disablePadding onClick={() => { navigate('/comparativa') }}>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <BarChartIcon />
                                        </ListItemIcon>
                                        <ListItemText> Comparativa </ListItemText>
                                    </ListItemButton>
                                </ListItem>
                                <List>
                                </List>
                            </Box>
                        </Drawer>
                    </Grid>
                    <Grid item xs={12}>
                        <Box component="main" sx={{ flexGrow: 1, p: 5 }} marginTop={5}>
                            {props.children}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}

