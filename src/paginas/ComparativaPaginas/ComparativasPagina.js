import React, { useState, useEffect } from 'react';
import { AppBar, TextField, Autocomplete, Grid, IconButton, Toolbar, Tooltip, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { MenuLateral } from '../../componentes/MenuLateral/MenuLateral';
import ComparativaDesktop from './ComparativaDesktop';
import { leerProductos, leerProductosVariedad } from '../../servicios/Productos';
import { leerVariedades, leerVariedadesProducto } from '../../servicios/Variedades';
import { leerClientes } from '../../servicios/Clientes';
import { leerEmpresa } from '../../servicios/Empresas';
import { leerDatos } from '../../servicios/comparativa';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import "dayjs/locale/es";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

dayjs.locale("es");

export default function ComparativasPagina() {
  const [open, setOpen] = useState(false);
  const [productos, setProductos] = useState([]);
  const [codprodu, setCodProdu] = useState(null);
  const [variedades, setVariedades] = useState([]);
  const [codvarie, setCodVarie] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [codclien, setCodClien] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [codempre, setCodEmpre] = useState([]);
  const [datosComparativa, setDatosComparativa] = useState([]);
  const [loadingComparativa, setLoadingComparativa] = useState(false); // Control de carga
  const [errorComparativa, setErrorComparativa] = useState(null);
  //
  const [selectedEmpresas, setSelectedEmpresas] = useState([]);
  const [error, setError] = useState(false);


  const [date, setDate] = useState(dayjs());
  const [dateFormat, setDateFormat] = useState(dayjs(new Date()).format("MM-DD"));

  const handleDateChange = (newDate) => {
    if (newDate) {
      setDateFormat(dayjs(newDate).format("MM-DD")); // Guarda solo mes y día
    }
  };


  const obtenerProductos = async (codvarie) => {
    if(codvarie) {
      const { data: productosLeidos } = await leerProductosVariedad(codvarie);
      setProductos(productosLeidos);
      return;
    }
    const { data: productosLeidos } = await leerProductos();
    setProductos(productosLeidos);
  };

  const obtenerVariedades = async (val) => {
    if(val) {
      const { data: variedadesLeidas } = await leerVariedadesProducto(val);
      setVariedades(variedadesLeidas);
      return;
    }
    const { data: variedadesLeidas } = await leerVariedades();
    setVariedades(variedadesLeidas);
  };

  const obtenerClientes = async (val) => {
    const { data: clientesLeidos } = await leerClientes();
    setClientes(clientesLeidos);
  };

  const obtenerEmpresas = async () => {
    const { data: empresasLeidas } = await leerEmpresa();
    setEmpresas(empresasLeidas);
  };

  const obtenDatosComparativa = async (producto, variedad, cliente, empresas, dateFormat) => {
    try {
      if (selectedEmpresas.length < 2) {
        setError(true);
      } else {
        setError(false);
        setOpen(false);//cerramos el modal
        setLoadingComparativa(true); // Indicar que está cargando
        setErrorComparativa(null); // Resetear errores previos
        const payload = { producto, variedad, cliente, empresas, dateFormat };
        const { data: datos } = await leerDatos(payload);
        setDatosComparativa(datos);
      }
    } catch (error) {
      setErrorComparativa(error.message || 'Error al obtener los datos');
    } finally {
      setLoadingComparativa(false);
    }
  };

  const handleChangeProducto = (e, value) => {
    // Actualiza el estado
    setCodProdu(value?.codprodu || null);
    
    // Evento adicional (por ejemplo, un log)
    obtenerVariedades(value?.codprodu || null)
  };

  const handleChangeVariedad = (e, value) => {
    // Actualiza el estado
    setCodVarie(value?.codvarie || null)
    
    // Evento adicional (por ejemplo, un log)
    obtenerProductos(value?.codvarie || null)
  };

  const handleChangeCliente = (e, value) => {
    setCodClien(value?.codclien || null)
  };

  const openModalComparativa = () => {
     // Reiniciar todos los estados relevantes
  setCodProdu(null);
  setCodVarie(null);
  setCodClien(null); // Restablecer cliente a null
  setCodEmpre([]);
  setSelectedEmpresas([]);
  setError(false);

    obtenerProductos(null);
    obtenerVariedades(null);
    obtenerClientes(null);
    obtenerEmpresas();

    setOpen(true)
  }

  useEffect(() => {
    obtenerProductos(null);
    obtenerVariedades(null);
    obtenerClientes(null);
    obtenerEmpresas();
  }, []);

  return (
    <>
      <MenuLateral>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AppBar position="static" color="default">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Comparativas
                </Typography>
                <IconButton size="large" onClick={ openModalComparativa } sx={{ backgroundColor: 'lightblue', color: 'black' }}>
                  <Tooltip title="Nueva comparativa">
                    <AddIcon />
                  </Tooltip>
                </IconButton>
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid item xs={12}>
            {loadingComparativa ? (
              <Typography>Cargando datos de comparativa...</Typography>
            ) : errorComparativa ? (
              <Typography color="error">{errorComparativa}</Typography>
            ) : (
              <ComparativaDesktop datosComparativa={datosComparativa} />
            )}
          </Grid>
        </Grid>
      </MenuLateral>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Nueva Comparativa</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Producto */}
            <Grid item xs={12} md={4}>
              <Autocomplete
                options={productos}
                getOptionLabel={(option) => option.nomprodu || ''}
                onChange={ handleChangeProducto }
                renderInput={(params) => <TextField {...params} label="Producto" />}
              />
            </Grid>
            {/* Variedad */}
            <Grid item xs={12} md={4}>
              <Autocomplete
                options={variedades}
                getOptionLabel={(option) => option.nomvarie || ''}
                onChange={ handleChangeVariedad }
                renderInput={(params) => <TextField {...params} label="Variedad" />}
              />
            </Grid>
            {/* Cliente */}
            <Grid item xs={12} md={4}>
              <Autocomplete
                options={clientes}
                getOptionLabel={(option) => option.nomclien || ''}
                onChange={ handleChangeCliente }
                renderInput={(params) => <TextField {...params} label="Cliente" />}
              />
            </Grid>
            {/* Empresas */}
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={empresas}
                getOptionLabel={(option) => option.nomempre || ''}
                onChange={(e, value) => {setCodEmpre(value || []); setSelectedEmpresas(value || [])}}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Empresas"
                    error={error}
                    helperText={error ? 'Selecciona al menos dos empresas.' : ''}
                  />
                )}
              />
            </Grid>
            {/* Calendario */}
            <Grid item xs={12} md={12}>
             
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                <DatePicker
                  value={date}
                  label="HASTA FECHA"
                  onChange={handleDateChange}
                  views={["month", "day"]} 
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={() => obtenDatosComparativa(codprodu, codvarie, codclien, codempre, dateFormat)}>Crear</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
