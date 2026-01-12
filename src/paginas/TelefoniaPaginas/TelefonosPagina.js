import React, { useState, useEffect, useContext } from 'react';
import { AppBar, TextField, Grid, IconButton, Toolbar, Tooltip, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { MenuLateral } from '../../componentes/MenuLateral/MenuLateral';
import TelefonosDesktop from './TelefonosDesktop';
import { leerCliente, leerTelefonos } from '../../servicios/Clientes';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import "dayjs/locale/es";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MensajeError } from '../../utilidades/TratamientoErrores'
import { ErrorGeneral } from '../../componentes/ErrorGeneral/ErrorGeneral';
import { MensajeInformativo } from '../../componentes/MensajeInformativo/MensajeInformativo';
import { GeneralCtx } from '../../contextos/GeneralContext'
import { leerDatos } from '../../servicios/comparativa';

export default function TelefonosPagina() {

  const [open, setOpen] = useState(false);
  const [datosTelefonos, setDatosTelefonos] = useState([]);
  const [loadingTelefonos, setLoadingTelefonos] = useState(false); // Control de carga
  const [errorTelefonos, setErrorTelefonos] = useState(null);
  const [hayMensaje, setHayMensaje] = useState(false);
  //
  const [hayError, setHayError] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  //
  const [codigoCliente, setCodigoCliente] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");

  const [hcodigoCliente, sethCodigoCliente] = useState("");
  const [hnombreCliente, sethNombreCliente] = useState("");
  //
  const { getSession } = useContext(GeneralCtx);

  const [nomEmpre, setNomempre ] = useState("");


  //


  const [date, setDate] = useState(dayjs());
  const [hDate, setHDate] = useState(dayjs());

  const handleDateChange = (newDate) => {
    if (newDate) {
      setDate(newDate); // mantenerlo como dayjs
    }
  };

  const handlehDateChange = (newDate) => {
    if (newDate) {
      setHDate(newDate); // mantenerlo como dayjs
    }
  };

  const obtenerCliente = async (e) => {
    const nuevoCodigo = e.target.value;
    setCodigoCliente(nuevoCodigo);

    if (nuevoCodigo) {
      try {
        const clienteLeido = await leerCliente(nuevoCodigo);
        setNombreCliente(clienteLeido.nomclien || "");
        setMensajeError('')
        setHayError(false)
      } catch (error) {
        setMensajeError(MensajeError(error))
        setHayError(true)
        //setCodigoCliente(null);
        setNombreCliente(''); // limpiar si hay error
      }
    } else {
      setNombreCliente(""); // limpiar si se borra el código
    }
  };

  const obtenerhCliente = async (e) => {
    const nuevoCodigo = e.target.value;
    sethCodigoCliente(nuevoCodigo);

    if (nuevoCodigo) {
      try {
        const clienteLeido = await leerCliente(nuevoCodigo);
        sethNombreCliente(clienteLeido.nomclien || "");
        setMensajeError('')
        setHayError(false)
      } catch (error) {
        setMensajeError(MensajeError(error))
        setHayError(true)
        //setCodigoCliente(null);
        sethNombreCliente(''); // limpiar si hay error
      }
    } else {
      sethNombreCliente(""); // limpiar si se borra el código
    }
  };


  const obtenDatosTelefonos = async () => {
    try {
      setHayError(false);
      setOpen(false);
      setLoadingTelefonos(true);
      setErrorTelefonos(null);

      /* const payload = {
        dateFormat: date.format("YYYY-MM-DD"),
        hDateFormat: hDate.format("YYYY-MM-DD"),
        codagent: codigoCliente,
        hcodagent: hcodigoCliente,
        anyoAnterior: checked,
        nomEmpre: nomEmpre
      }; */

      const { data: datos } = await leerTelefonos();
      setDatosTelefonos(datos);

    } catch (error) {
      setErrorTelefonos(error.message || 'Error al obtener los datos');
    } finally {
      setLoadingTelefonos(false);
    }
  };



  const openModalTelefonos = () => {
    setHayError(false);
    setCodigoCliente(null);
    setNombreCliente('');
    sethCodigoCliente(null);
    sethNombreCliente('');
    setDate(dayjs());
    setHDate(null);

    setOpen(true)
  }

  useEffect(() => {
    setCodigoCliente(null);
    setNombreCliente('');
    sethCodigoCliente(null);
    sethNombreCliente('');
    setDate(dayjs());
    setHDate(null);
    let sesion = getSession();
    let n = sesion.empresa.nomempre;
    setNomempre(n);
    obtenDatosTelefonos();
  }, []);

  return (
    <>
      <MenuLateral>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AppBar position="static" color="default">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Telefonos
                </Typography>
                <IconButton size="large" onClick={openModalTelefonos} sx={{ backgroundColor: 'lightblue', color: 'black' }}>
                  <Tooltip title="Nueva telefonos">
                    <AddIcon />
                  </Tooltip>
                </IconButton>
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid item xs={12}>
            {loadingTelefonos ? (
              <Typography>Cargando datos de telefonos...</Typography>
            ) : errorTelefonos ? (
              <Typography color="error">{errorTelefonos}</Typography>
            ) : (
              <TelefonosDesktop datosTelefonos={datosTelefonos} />
            )}
          </Grid>
        </Grid>
        <ErrorGeneral hayError={hayError} mensajeError={mensajeError} cerrarError={() => setHayError(false)} />
        <MensajeInformativo hayMensaje={hayMensaje} mensaje={MensajeError} cerrarMensaje={() => setHayMensaje(false)} />
      </MenuLateral>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Buscar plazos pendientes </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* checkbox */}
            <Grid item xs={12} md={8}></Grid>
            
            {/* Calendario */}
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                <DatePicker
                  value={date}
                  label="DESDE FECHA"
                  onChange={handleDateChange}
                  views={["day", "month", "year"]}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal", // mejora espaciado vertical
                      sx: { minHeight: 80 } // previene corte del label
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {/* Calendario */}
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                <DatePicker
                  value={hDate}
                  label="HASTA FECHA"
                  onChange={handlehDateChange}
                  views={["day", "month", "year"]}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal", // mejora espaciado vertical
                      sx: { minHeight: 80 } // previene corte del label
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {/*desde cliente*/}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="desde código de Cliente"
                type="number"
                value={codigoCliente}
                onChange={obtenerCliente}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={9}>
              <TextField
                fullWidth
                label="Nombre del Cliente"
                value={nombreCliente}
                margin="normal"
                disabled
              />
            </Grid>

            {/*hasta cliente*/}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Hasta código de Cliente"
                type="number"
                value={hcodigoCliente}
                onChange={obtenerhCliente}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={9}>
              <TextField
                fullWidth
                label="Nombre del Cliente"
                value={hnombreCliente}
                margin="normal"
                disabled
              />
            </Grid>


          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={() => obtenDatosTelefonos(date, hDate)}>Crear</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
