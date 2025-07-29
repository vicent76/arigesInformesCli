import React, { useState, useEffect } from 'react';
import { AppBar, TextField, Grid, IconButton, Toolbar, Tooltip, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { MenuLateral } from '../../componentes/MenuLateral/MenuLateral';
import ComparativaDesktop from './ComparativaDesktop';
import { leerClientes } from '../../servicios/Clientes';
import { leerAgente } from '../../servicios/Agentes';
import { leerDatos } from '../../servicios/comparativa';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import "dayjs/locale/es";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MensajeError } from '../../utilidades/TratamientoErrores'
import { ErrorGeneral } from '../../componentes/ErrorGeneral/ErrorGeneral';
import { MensajeInformativo } from '../../componentes/MensajeInformativo/MensajeInformativo';
import { Checkbox, FormControlLabel } from '@mui/material';


export default function ComparativasPagina() {

  const [open, setOpen] = useState(false);
  const [datosComparativa, setDatosComparativa] = useState([]);
  const [loadingComparativa, setLoadingComparativa] = useState(false); // Control de carga
  const [errorComparativa, setErrorComparativa] = useState(null);
  const [hayMensaje, setHayMensaje] = useState(false);
  //
  const [hayError, setHayError] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  //
  const [codigoAgente, setCodigoAgente] = useState("");
  const [nombreAgente, setNombreAgente] = useState("");

  const [hcodigoAgente, sethCodigoAgente] = useState("");
  const [hnombreAgente, sethNombreAgente] = useState("");
  //
  const [checked, setChecked] = useState(false);



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

  const obtenerAgente = async (e) => {
    const nuevoCodigo = e.target.value;
    setCodigoAgente(nuevoCodigo);

    if (nuevoCodigo) {
      try {
        const agenteLeido = await leerAgente(nuevoCodigo);
        setNombreAgente(agenteLeido.nomagent || "");
        setMensajeError('')
        setHayError(false)
      } catch (error) {
        setMensajeError(MensajeError(error))
        setHayError(true)
        //setCodigoAgente(null);
        setNombreAgente(''); // limpiar si hay error
      }
    } else {
      setNombreAgente(""); // limpiar si se borra el código
    }
  };

  const obtenerhAgente = async (e) => {
    const nuevoCodigo = e.target.value;
    sethCodigoAgente(nuevoCodigo);

    if (nuevoCodigo) {
      try {
        const agenteLeido = await leerAgente(nuevoCodigo);
        sethNombreAgente(agenteLeido.nomagent || "");
        setMensajeError('')
        setHayError(false)
      } catch (error) {
        setMensajeError(MensajeError(error))
        setHayError(true)
        //setCodigoAgente(null);
        sethNombreAgente(''); // limpiar si hay error
      }
    } else {
      sethNombreAgente(""); // limpiar si se borra el código
    }
  };


  const obtenDatosComparativa = async () => {
    try {
      setHayError(false);
      setOpen(false);
      setLoadingComparativa(true);
      setErrorComparativa(null);

      const payload = {
        dateFormat: date.format("DD-MM-YYYY"),
        hDateFormat: hDate.format("DD-MM-YYYY"),
        codagent: codigoAgente,
        hcodagent: hcodigoAgente,
        anyoAnterior: checked
      };

      const { data: datos } = await leerDatos(payload);
      setDatosComparativa(datos);

    } catch (error) {
      setErrorComparativa(error.message || 'Error al obtener los datos');
    } finally {
      setLoadingComparativa(false);
    }
  };



  const openModalComparativa = () => {
    setHayError(false);
    setCodigoAgente(null);
    setNombreAgente('');
    sethCodigoAgente(null);
    sethNombreAgente('');
    setDate(dayjs());
    setHDate(null);
    setChecked(false);

    setOpen(true)
  }

  useEffect(() => {
    setCodigoAgente(null);
    setNombreAgente('');
    sethCodigoAgente(null);
    sethNombreAgente('');
    setDate(dayjs());
    setHDate(null);
    setChecked(false);
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
                <IconButton size="large" onClick={openModalComparativa} sx={{ backgroundColor: 'lightblue', color: 'black' }}>
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
        <ErrorGeneral hayError={hayError} mensajeError={mensajeError} cerrarError={() => setHayError(false)} />
        <MensajeInformativo hayMensaje={hayMensaje} mensaje={MensajeError} cerrarMensaje={() => setHayMensaje(false)} />
      </MenuLateral>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Nueva Comparativa</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* checkbox */}
            <Grid item xs={12} md={8}></Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                    color="primary"
                  />
                }
                label="Comparar con el año anterior"
                sx={{ marginLeft: "2.98%" }} // 🔧 Forzar alineación
              />
            </Grid>
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

            {/*desde agente*/}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="desde código de Agente"
                type="number"
                value={codigoAgente}
                onChange={obtenerAgente}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={9}>
              <TextField
                fullWidth
                label="Nombre del Agente"
                value={nombreAgente}
                margin="normal"
                disabled
              />
            </Grid>

            {/*hasta agente*/}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Hasta código de Agente"
                type="number"
                value={hcodigoAgente}
                onChange={obtenerhAgente}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={9}>
              <TextField
                fullWidth
                label="Nombre del Agente"
                value={hnombreAgente}
                margin="normal"
                disabled
              />
            </Grid>


          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={() => obtenDatosComparativa(date, hDate)}>Crear</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
