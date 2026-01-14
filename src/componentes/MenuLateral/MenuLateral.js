import React, { useContext, useEffect, useState } from 'react';
import {
    Box,
    Drawer,
    AppBar,
    CssBaseline,
    Toolbar,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    IconButton,
    Tooltip,
    Typography,
    Collapse
} from '@mui/material';
import {
    Home,
    ExitToApp,
    Person,
    BarChart,
    Phone,
    PhoneDisabled,
    Menu as MenuIcon,
    Description
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { GeneralCtx } from '../../contextos/GeneralContext';
import { leerVersion } from '../../servicios/ApiLib';
import { TipoPantalla } from '../../utilidades/ControlPantalla';

const drawerWidth = 60;

export const MenuLateral = ({ children }) => {
    const navigate = useNavigate();
    const { getSession, deleteSession } = useContext(GeneralCtx);

    const [sesion, setSesion] = useState();
    const [version, setVersion] = useState('0.0.0');
    const [drOpen, setDrOpen] = useState(false);
    const [tipoPantalla, setTipoPantalla] = useState('desktop');

    // Estados de submenú
    const [openInformes, setOpenInformes] = useState(true);

    useEffect(() => {
        const session = getSession();
        if (!session) navigate('/');
        setSesion(session);

        const init = async () => {
            const { data } = await leerVersion();
            setVersion(data.version);
            setTipoPantalla(TipoPantalla());
        };
        init();
    }, []);

    const handleLogout = () => {
        deleteSession();
        navigate('/');
    };

    const MenuItem = ({ icon, label, onClick, openSubmenu, setOpenSubmenu }) => (
        <Tooltip title={label} placement="right">
            <ListItem disablePadding sx={{ justifyContent: 'center' }}>
                <ListItemButton
                    onClick={onClick || (() => setOpenSubmenu(!openSubmenu))}
                    sx={{ justifyContent: 'center' }}
                >
                    <ListItemIcon sx={{ minWidth: 'unset', justifyContent: 'center' }}>
                        {icon}
                    </ListItemIcon>
                </ListItemButton>
            </ListItem>
        </Tooltip>
    );

    const TreeItem = ({ icon, label, onClick, isLast }) => (
        <Tooltip title={label} placement="right">
            <ListItem disablePadding>
                <ListItemButton
                    onClick={onClick}
                    sx={{ pl: 4, position: 'relative' }}
                >
                    {/* Línea vertical */}
                    <Box
                        sx={{
                            position: 'absolute',
                            left: 16,
                            top: 0,
                            bottom: isLast ? '50%' : 0,
                            width: '2px',
                            bgcolor: 'rgba(0,0,0,0.3)',
                        }}
                    />
                    {/* Línea horizontal */}
                    <Box
                        sx={{
                            position: 'absolute',
                            left: 16,
                            top: '50%',
                            width: 20,
                            height: '2px',
                            bgcolor: 'rgba(0,0,0,0.3)',
                        }}
                    />
                    <ListItemIcon sx={{ minWidth: 30 }}>{icon}</ListItemIcon>
                </ListItemButton>
            </ListItem>
        </Tooltip>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            {/* AppBar */}
            <AppBar position="fixed" sx={{ zIndex: t => t.zIndex.drawer + 1 }}>
                <Toolbar>
                    {tipoPantalla === 'mobile' && (
                        <IconButton color="inherit" onClick={() => setDrOpen(!drOpen)}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography sx={{ flexGrow: 1 }}>
                        Ariges Informes VRS: {version}
                    </Typography>
                    <IconButton color="inherit">
                        <Person />
                        <Typography ml={1}>{sesion?.usuario?.nomusu}</Typography>
                    </IconButton>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <ExitToApp />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Drawer */}
            <Drawer
                variant={tipoPantalla === 'mobile' ? 'temporary' : 'permanent'}
                open={tipoPantalla === 'mobile' ? drOpen : true}
                onClose={() => setDrOpen(false)}
                sx={{
                    width: drawerWidth,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        overflowX: 'hidden',
                    },
                }}
            >
                <Toolbar />
                <List>
                    <MenuItem
                        icon={<Home fontSize="large" />}
                        label="Inicio"
                        onClick={() => navigate('/inicio')}
                    />

                    {/* Informes */}
                    <MenuItem
                        icon={<Description fontSize="large" />}
                        label="Informes"
                        openSubmenu={openInformes}
                        setOpenSubmenu={setOpenInformes}
                    />
                    <Collapse in={openInformes}>
                        <List disablePadding>
                            <TreeItem
                                icon={<BarChart fontSize="small" />}
                                label="Comparativa de ventas"
                                onClick={() => navigate(`/comparativa/?reload=${Date.now()}`)}
                                isLast={false}
                            />
                            <TreeItem
                                icon={<Phone fontSize="small" />}
                                label="Plazos pendientes de telefonía"
                                onClick={() => navigate(`/telefonosPlazos`)}
                                isLast={false}
                            />
                            <TreeItem
                                icon={<PhoneDisabled fontSize="small" />}
                                label="Plazos pendientes de telefonía"
                                onClick={() => navigate(`/telefonosVencidos`)}
                                isLast
                            />
                        </List>
                    </Collapse>
                </List>
            </Drawer>

            {/* Contenido */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 5,
                    mt: '64px',
                    ml: tipoPantalla === 'mobile' ? 0 : `${drawerWidth}px`,
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

