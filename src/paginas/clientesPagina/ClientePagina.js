import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
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
import moment from 'moment';

import { MenuLateral } from '../../componentes/MenuLateral/MenuLateral';
import { MensajeError } from '../../utilidades/TratamientoErrores'
import { ErrorGeneral } from '../../componentes/ErrorGeneral/ErrorGeneral';
import { MensajeInformativo } from '../../componentes/MensajeInformativo/MensajeInformativo';
import { useNavigate } from 'react-router-dom';
import { EventSeatSharp } from '@mui/icons-material';
import { Alert, CircularProgress } from '@mui/material';

import TelefonosClienteGrid from './TelefonosClienteGrid';
import { buscarClientes, leerCliente, leerTelefonosCliente } from '../../servicios/Clientes';


var logindata = {};

export const ClientePagina = () => {

    const [hayError, setHayError] = useState(false);
    const [mensajeError, setMensajeError] = useState('');
    //
    const [hayMensaje, setHayMensaje] = useState(false);
    const [mensaje] = useState('');
    //
    const navigate = useNavigate();
    //
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);
    //
    const [codclien, setCodclien] = useState(null)
    const [clientes, setClientes] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [loadingClientes, setLoadingClientes] = useState(false);
    //
    const [cliente, setCliente] = useState({
        codclien: '',
        nomclien: '',
        nomcomer: '',
        domclien: '',
        codpobla: '',
        pobclien: '',
        proclien: '',
        nifclien: '',
        fechaalt: '',
        iban: '',
        codbanco: '',
        codsucur: '',
        digcontr: '',
        cuentaba: '',
        perclie1: '',
        telclie1: '',
        faxclie1: '',
        maiclie1: '',
        perclie2: '',
        telclie2: '',
        faxclie2: '',
        maiclie2: '',
    });
    //
    const [datosTelefonos, setDatosTelefonos] = useState([]);
    const [loadingTelefonos, setLoadingTelefonos] = useState(false);
    const [errorTelefonos, setErrorTelefonos] = useState(null);
    //
    const [tabActual, setTabActual] = useState(0);
    //
    const location = useLocation();

    const cambiarTab = (Event, nuevoTab) => {
        setTabActual(nuevoTab)
    }

    const mostrarError = (error, mensajeDefecto) => {
        console.error(mensajeDefecto, error);

        const mensaje =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            mensajeDefecto;

        setMensajeError(
            typeof mensaje === 'string' ? mensaje : mensajeDefecto
        );
        setHayError(true);
    };

    const estableceClientes = async (scliente) => {

        if (!scliente?.codclien) {
            setError(true);
            return false;
        }

        try {
            setHayError(false);
            setMensajeError('');

            const codclien = scliente.codclien;

            const datos = await leerCliente(codclien);

            if (!datos || Array.isArray(datos)) {
                throw new Error('No se han recibido correctamente los datos del cliente');
            }

            cargarCliente(datos);

            setOpen(false);

            // Los teléfonos tienen su propio tratamiento de errores
            obtenDatosTelefonos(codclien);

            return true;

        } catch (error) {
            mostrarError(error, 'Error al cargar los datos del cliente');
            return false;
        }
    };

    const cargarCliente = (datos) => {
        setCliente({
            codclien: datos?.codclien ?? '',
            nomclien: datos?.nomclien ?? '',
            nomcomer: datos?.nomcomer ?? '',
            domclien: datos?.domclien ?? '',
            codpobla: datos?.codpobla ?? '',
            pobclien: datos?.pobclien ?? '',
            proclien: datos?.proclien ?? '',
            nifclien: datos?.nifclien ?? '',
            fechaalt: datos?.fechaalt ? moment(datos.fechaalt).format('DD/MM/YYYY') : '',
            iban: datos?.iban ?? '',
            codbanco: datos?.codbanco ?? '',
            codsucur: datos?.codsucur ?? '',
            digcontr: datos?.digcontr ?? '',
            cuentaba: datos?.cuentaba ?? '',
            perclie1: datos?.perclie1 ?? '',
            telclie1: datos?.telclie1 ?? '',
            faxclie1: datos?.faxclie1 ?? '',
            maiclie1: datos?.maiclie1 ?? '',
            perclie2: datos?.perclie2 ?? '',
            telclie2: datos?.telclie2 ?? '',
            faxclie2: datos?.faxclie2 ?? '',
            maiclie2: datos?.maiclie2 ?? ''
        });
        //componerIban(datos)
    };

    // Cargar datos de teléfonos
    const obtenDatosTelefonos = async (codclien) => {

        setLoadingTelefonos(true);
        setErrorTelefonos(null);
        setDatosTelefonos([]);

        try {
            const respuesta = await leerTelefonosCliente(codclien);

            // Adaptar según lo que devuelve el servicio
            const datos = Array.isArray(respuesta)
                ? respuesta
                : respuesta?.data;

            if (!Array.isArray(datos)) {
                throw new Error('La API no ha devuelto un listado válido de teléfonos');
            }

            const datosConId = datos.map(item => {

                const plazosOrigen = Number(item.PlazosOrigen) || 0;
                const plazosMeses = Number(item.PlazosMeses) || 0;
                const importePlazo = Number(item.ImportePlazo) || 0;

                const cuotasPendientes = plazosOrigen - plazosMeses;
                const importePendiente = cuotasPendientes * importePlazo;

                return {
                    ...item,
                    id: `${item.codclien}-${item.IdTelefono}`,
                    CuotasPendientes: cuotasPendientes,
                    ImportePendiente: importePendiente
                };
            });

            setDatosTelefonos(datosConId);

        } catch (error) {

            console.error('Error al obtener teléfonos:', error);

            const mensaje =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                'Error al obtener los teléfonos';

            setErrorTelefonos(
                typeof mensaje === 'string'
                    ? mensaje
                    : 'Error al obtener los teléfonos'
            );

        } finally {
            setLoadingTelefonos(false);
        }
    };

    const componerIban = (cliente) => {

        if (!cliente) return '';

        const iban = String(cliente.iban ?? '').trim().toUpperCase();
        const banco = String(cliente.codbanco ?? '').padStart(4, '0');
        const sucursal = String(cliente.codsucur ?? '').padStart(4, '0');
        const dc = String(cliente.digcontr ?? '').padStart(2, '0');
        const cuenta = String(cliente.cuentaba ?? '').padStart(10, '0');

        if (!/^ES\d{2}$/.test(iban) ||
            !cliente.codbanco ||
            !cliente.codsucur ||
            !cliente.digcontr ||
            !cliente.cuentaba) {
            return '';
        }

        return `ES${iban}${banco}${sucursal}${dc}${cuenta}`;
    };


    useEffect(() => {
        setOpen(true);
    }, [location.search]);

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
            <MenuLateral>
                <Box sx={{ width: '100%', p: 2 }} className='fondoImagenLogin'>

                    <Tabs
                        value={tabActual}
                        onChange={cambiarTab}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ borderBottom: 1, borderColor: 'divider' }}
                    >
                        <Tab sx={{ fontWeight: 'bolder' }} label="Datos del cliente" />
                        <Tab sx={{ fontWeight: 'bolder' }} label="Telefonos" />
                        <Tab sx={{ fontWeight: 'bolder' }} label="Documentos" />
                    </Tabs>

                    {hayError && (
                        <Alert
                            severity="error"
                            onClose={() => setHayError(false)}
                            sx={{ mt: 2 }}
                        >
                            {mensajeError}
                        </Alert>
                    )}

                    {/* PESTAÑA 1: DATOS DEL CLIENTE */}
                    {tabActual === 0 && (
                        <Box sx={{ p: 3, backgroundColor: 'white' }}>
                            <Typography variant="h6" gutterBottom>
                                Datos del cliente
                            </Typography>

                            <Grid container spacing={2}>
                                {/* CAJA IZQUIERDA */}
                                <Grid item xs={12} md={6} sx={{}}>
                                    <Box
                                        sx={{
                                            border: '1px solid #ddd',
                                            borderRadius: 2,
                                            p: 2,
                                            mt: 2,
                                            background: 'linear-gradient(135deg, #fdfdfd 0%, #ffffff 100%)'
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            sx={{ fontWeight: 'bold', mb: 2 }}
                                        >
                                            General
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={2}>
                                                <TextField
                                                    label="Código"
                                                    value={cliente?.codclien ?? ''}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={3}>
                                                <TextField
                                                    label="Nombre del cliente"
                                                    value={cliente?.nomclien ?? ''}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <TextField
                                                    label="Nombre comercial"
                                                    value={cliente?.nomcomer ?? ''}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={2}>
                                                <TextField
                                                    label="Fecha alta"
                                                    value={cliente?.fechaalt ?? ''}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={2}>
                                                <TextField
                                                    label="NIF"
                                                    value={cliente?.nifclien ?? ''}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    label="Domicilio"
                                                    value={cliente?.domclien ?? ''}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    label="Poblacion"
                                                    value={cliente?.pobclien ?? ''}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={2}>
                                                <TextField
                                                    label="Provincia"
                                                    value={cliente?.proclien ?? ''}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12}>
                                                <TextField
                                                    label="IBAN"
                                                    value={cliente?.iban.replace(/(.{4})/g, '$1 ').trim() ?? ''}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                        </Grid>

                                    </Box>
                                </Grid>
                                {/* CAJA DERECHA */}
                                <Grid item xs={12} md={6}>
                                    <Box
                                        sx={{
                                            border: '1px solid #ddd',
                                            borderRadius: 2,
                                            p: 2,
                                            mt: 2,
                                            background: 'linear-gradient(135deg, #fdfdfd 0%, #ffffff 100%)'
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            sx={{ fontWeight: 'bold', mb: 2 }}
                                        >
                                            Datos de contacto
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    label="Contacto 1"
                                                    value={cliente?.perclie1 ?? ''}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={2}>
                                                <TextField
                                                    label="Telefono 1"
                                                    value={cliente?.telclie1 ?? ''}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={2}>
                                                <TextField
                                                    label="Fax 1"
                                                    value={cliente?.faxclie1 ?? ''}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    label="Email 1"
                                                    value={cliente?.maiclie1 ?? ''}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    label="Contacto 2"
                                                    value={cliente?.perclie2 ?? ''}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={2}>
                                                <TextField
                                                    label="Telefono 2"
                                                    value={cliente?.telclie2 ?? ''}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={2}>
                                                <TextField
                                                    label="Fax 2"
                                                    value={cliente?.faxclie2 ?? ''}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    label="Email 2"
                                                    value={cliente?.maiclie2 ?? ''}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                        </Grid>

                                    </Box>
                                </Grid>

                            </Grid>
                        </Box>
                    )}

                    {/* PESTAÑA 2: TELEFONOS */}
                    {tabActual === 1 && (
                        <Box sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Teléfonos
                            </Typography>

                            {loadingTelefonos && (
                                <CircularProgress size={24} />
                            )}

                            {errorTelefonos && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {errorTelefonos}
                                </Alert>
                            )}

                            {!loadingTelefonos && !errorTelefonos && (
                                <TelefonosClienteGrid
                                    datosTelefonos={datosTelefonos}
                                />
                            )}
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
                            renderOption={(props, option) => {
                                const { key, ...rest } = props;

                                return (
                                    <li {...rest} key={option.codclien}>
                                        {option.codclien} - {option.nomclien}
                                    </li>
                                );
                            }}
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
                                setCodclien(value?.codclien ?? null);
                                setSelectedCliente(value);
                                setError(false);

                                if (value) {
                                    estableceClientes(value);
                                }
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
                        {hayError && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {mensajeError}
                            </Alert>
                        )}
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                    </DialogActions>
                </Dialog>
            </MenuLateral>
        </>
    )
}