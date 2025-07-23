import React from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { MenuLateral } from '../MenuLateral/MenuLateral'
import 'leaflet/dist/leaflet.css';
import './MostrarMapa.css'
import L from 'leaflet';
import { Button, Grid } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export const MostrartMapa = () => {
  const API_KEY = 'AIzaSyAYlOA-hd-7SmzYZqbJ74gfM6ityDh3U64'
  const navigate = useNavigate()
  const location = useLocation()

  const salirForm = () => {
    navigate(-1)
  }

  return (
    <>
      <MenuLateral>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            <Button color="success" variant="contained" onClick={salirForm}>
              Salir
            </Button>
          </Grid>
          <Grid item xs={12}>
            <MapContainer center={[location.state.latitud, location.state.longitud]} zoom={18} scrollWheelZoom={true} style={{ height: "100vh" }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[location.state.latitud, location.state.longitud]} ic>
                <Popup>
                  Hora Fichaje: {location.state.fechaHora} <br/>
                  Latitud: {location.state.latitud} <br/>
                  Longitud: {location.state.longitud}
                </Popup>
              </Marker>
            </MapContainer>
          </Grid>
        </Grid>
      </MenuLateral>
    </>
  )
}
