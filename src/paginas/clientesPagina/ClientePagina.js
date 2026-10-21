import React, { useState, useEffect } from 'react'
import {
    Button,
    Grid,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Autocomplete,
    Box,
    Tabs,
    Tab,
    Typography
} from '@mui/material';

import { MensajeError } from '../../utilidades/TratamientoErrores'
import { ErrorGeneral } from '../../componentes/ErrorGeneral/ErrorGeneral';
import { MensajeInformativo } from '../../componentes/MensajeInformativo/MensajeInformativo';
import { useNavigate } from 'react-router-dom';
import { EventSeatSharp } from '@mui/icons-material';

import { leerClientes, buscarClientes } from '../../servicios/Clientes';


var logindata = {};

export const ClientePagina = () => {
    const [hayError, setHayError] = useState(false);
    const [mensajeError, setMensajeError] = useState('');
    const [hayMensaje, setHayMensaje] = useState(false);
    const [mensaje] = useState('');
    const navigate = useNavigate();
    //
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);
    //
    const [clientes, setClientes] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [loadingClientes, setLoadingClientes] = useState(false);
    //
    const [codclien, setCodclien] = useState(null);
    //
    const [tabActual, setTabActual] = useState(0);

    const cambiarTab = (Event, nuevoTab) => {
        setTabActual(nuevoTab)
    }


    const estableceClientes = async () => {
        console.log('selectedCliente:', selectedCliente);

        if (!selectedCliente || Object.keys(selectedCliente).length === 0) {
            setError(true);
            console.warn('No se seleccionó ningun Cliente.');
            return;
        }
    };


    useEffect(() => {
        setOpen(true);
    }, []);

    useEffect(() => {
        if (busqueda.trim().length < 3) {
            setClientes([]);
            setLoadingClientes(false);
            return;
        }

        let activo = true;

        const timer = setTimeout(async () => {
            setLoadingClientes(true);

            try {

                const clientesLeidos = await buscarClientes(busqueda.trim());


                if (activo) {
                    setClientes(Array.isArray(clientesLeidos) ? clientesLeidos : []);
                }

            } catch (error) {
                if (activo) {
                    console.error('Error buscando clientes:', error);
                    setClientes([]);
                }

            } finally {
                if (activo) {
                    setLoadingClientes(false);
                }
            }
        }, 300);

        return () => {
            activo = false;
            clearTimeout(timer);
        };

    }, [busqueda]);

    return (
        <>
            <Box sx={{ width: '100%', p: 2 }}>

                <Tabs
                    value={tabActual}
                    onChange={cambiarTab}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Datos del cliente" />
                    <Tab label="Contactos" />
                    <Tab label="Documentos" />
                </Tabs>

                {/* PESTAÑA 1: DATOS DEL CLIENTE */}
                {tabActual === 0 && (
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Datos del cliente
                        </Typography>
                        <Box
                            sx={{
                                border: '1px solid #ddd',
                                borderRadius: 2,
                                p: 2,
                                mt: 2
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 'bold', mb: 2 }}
                            >
                                Datos de contacto
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        label="Código"
                                        value={selectedCliente?.codclien ?? ''}
                                        fullWidth
                                        size="small"
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={9}>
                                    <TextField
                                        label="Nombre del cliente"
                                        value={selectedCliente?.nomclien ?? ''}
                                        fullWidth
                                        size="small"
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                )}

                {/* PESTAÑA 2: CONTACTOS */}
                {tabActual === 1 && (
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6">
                            Contactos
                        </Typography>
                    </Box>
                )}

                {/* PESTAÑA 3: DOCUMENTOS */}
                {tabActual === 2 && (
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6">
                            Documentos
                        </Typography>
                    </Box>
                )}

            </Box>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>Clientes</DialogTitle>

                <DialogContent>
                    <Autocomplete
                        fullWidth
                        options={Array.isArray(clientes) ? clientes : []}
                        value={selectedCliente}
                        loading={loadingClientes}
                        filterOptions={(options) => options}
                        getOptionLabel={(option) => option?.nomclien || ''}
                        isOptionEqualToValue={(option, value) =>
                            option.codclien === value.codclien
                        }
                        onInputChange={(_event, value, reason) => {
                            if (reason === 'input') {
                                setBusqueda(value);
                            }

                            if (reason === 'clear') {
                                setBusqueda('');
                                setClientes([]);
                                setSelectedCliente(null);
                                setCodclien(null);
                            }
                        }}
                        onChange={(_event, value) => {
                            setCodclien(value?.codclien || null);
                            setSelectedCliente(value);
                            setError(false);
                        }}
                        noOptionsText={
                            busqueda.trim().length < 3
                                ? 'Escribe al menos 3 caracteres'
                                : 'No se encontraron clientes'
                        }
                        loadingText="Buscando clientes..."
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Buscar cliente"
                                placeholder="Escribe al menos 3 caracteres"
                                error={error}
                                helperText={error ? 'Selecciona un cliente.' : ''}
                                margin="normal"
                            />
                        )}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>

                    <Button variant="contained" onClick={estableceClientes}>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}