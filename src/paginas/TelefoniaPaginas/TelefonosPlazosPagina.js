import React, { useState, useEffect, useContext } from 'react';
import { Grid, Typography, IconButton, AppBar, Toolbar, Tooltip } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { MenuLateral } from '../../componentes/MenuLateral/MenuLateral';
import TelefonosPlazosDesktop from './TelefonosPlazosDesktop';
import TelefonosPlazosGrid from './TelefonosPlazosGrid';
import { leerTelefonos } from '../../servicios/Clientes';
import { GeneralCtx } from '../../contextos/GeneralContext';
import { ErrorGeneral } from '../../componentes/ErrorGeneral/ErrorGeneral';
import { MensajeInformativo } from '../../componentes/MensajeInformativo/MensajeInformativo';
import { MensajeError } from '../../utilidades/TratamientoErrores';

export default function TelefonosPlazosPagina() {

  const [datosTelefonos, setDatosTelefonos] = useState([]);
  const [loadingTelefonos, setLoadingTelefonos] = useState(false);
  const [errorTelefonos, setErrorTelefonos] = useState(null);
  const [hayMensaje, setHayMensaje] = useState(false);
  const [hayError, setHayError] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [mostrarReporte, setMostrarReporte] = useState(false);

  const { getSession } = useContext(GeneralCtx);

  // Cargar datos de teléfonos
  const obtenDatosTelefonos = async () => {
    try {
      setHayError(false);
      setLoadingTelefonos(true);
      setErrorTelefonos(null);

      const { data: datos } = await leerTelefonos();

      const datosConId = datos.map(item => {
        const plazosOrigen = Number(item.PlazosOrigen) || 0;
        const plazosMeses = Number(item.PlazosMeses) || 0;
        const importePlazo = Number(item.ImportePlazo) || 0;

        const cuotasPendientes = plazosOrigen - plazosMeses;
        const importePendiente = cuotasPendientes * importePlazo;

        return {
          id: `${item.codclien}-${item.IdTelefono}`, // combinación única
          ...item,
          CuotasPendientes: cuotasPendientes,
          ImportePendiente: importePendiente
        };
      });

      setDatosTelefonos(datosConId);

    } catch (error) {
      setErrorTelefonos(error.message || 'Error al obtener los datos');
    } finally {
      setLoadingTelefonos(false);
    }
  };

  useEffect(() => {
    obtenDatosTelefonos();
  }, []);

  // Abrir el reporte al pulsar el botón
  const handleOpenReport = () => {
    if (!datosTelefonos || datosTelefonos.length === 0) {
      setHayMensaje(true);
      return;
    }
    setMostrarReporte(true);
    // Scroll al report si quieres:
    setTimeout(() => {
      const container = document.getElementById('reportContainer');
      if (container) container.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <MenuLateral>
      {/* Toolbar superior */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2', mb: 2 }}>
        <Toolbar>
          {/* BOTÓN VOLVER, visible solo si el reporte está abierto */}
          {mostrarReporte && (
            <Tooltip title="Volver al Grid">
              <IconButton
                onClick={() => setMostrarReporte(false)}
                sx={{
                  backgroundColor: 'white',
                  color: '#1976d2',
                  '&:hover': { backgroundColor: '#e0e0e0' },
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  mr: 1 // margen a la derecha
                }}
              >
                {/* Puedes usar un icono de retroceso */}
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
          )}

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Telefonos y Plazos
          </Typography>

          {/* BOTÓN IMPRIMIR, visible solo si NO está el reporte */}
          {!mostrarReporte && (
            <Tooltip title="Abrir Reporte">
              <IconButton
                onClick={handleOpenReport}
                sx={{
                  backgroundColor: 'white',
                  color: '#1976d2',
                  '&:hover': { backgroundColor: '#e0e0e0' },
                  borderRadius: '50%',
                  width: 40,
                  height: 40
                }}
              >
                <PrintIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>

      </AppBar>

      <Grid container spacing={2} className='fondoImagenLogin'>
        <Grid item xs={12}>
          {loadingTelefonos ? (
            <Typography>Cargando datos de teléfonos...</Typography>
          ) : errorTelefonos ? (
            <Typography color="error">{errorTelefonos}</Typography>
          ) : (
            <>
              {!mostrarReporte && <TelefonosPlazosGrid datosTelefonos={datosTelefonos} />}
              {mostrarReporte && <TelefonosPlazosDesktop datosTelefonos={datosTelefonos} />}
            </>
          )}
        </Grid>
      </Grid>

      <ErrorGeneral hayError={hayError} mensajeError={mensajeError} cerrarError={() => setHayError(false)} />
      <MensajeInformativo hayMensaje={hayMensaje} mensaje={MensajeError} cerrarMensaje={() => setHayMensaje(false)} />
    </MenuLateral>
  );
}
