import { Typography } from '@mui/material';
import React, { useEffect } from 'react'


const MapaRutaDatos = (props) => {
    const renderMap = (datos) => {
        if (!datos.origen_reserva || !datos.destino_reserva) return
        const google = window.google;
        // Define el origen, destino y paradas
        var origen = new google.maps.LatLng(datos.origen_reserva.latitud, datos.origen_reserva.longitud);
        var destino = new google.maps.LatLng(datos.destino_reserva.latitud, datos.destino_reserva.longitud);
        var paradas = []
        if (datos.puntoRecogida1) paradas.push(new google.maps.LatLng(datos.puntoRecogida1.latitud, datos.puntoRecogida1.longitud))
        if (datos.puntoRecogida2) paradas.push(new google.maps.LatLng(datos.puntoRecogida2.latitud, datos.puntoRecogida2.longitud))
        if (datos.puntoRecogida3) paradas.push(new google.maps.LatLng(datos.puntoRecogida3.latitud, datos.puntoRecogida3.longitud))

        // Inicializa el mapa centrado en el origen
        var map = new google.maps.Map(document.getElementById('map'), {
            center: origen,
            zoom: 8
        });

        // Crea los marcadores para el origen, destino y paradas
        var origenMarker = new google.maps.Marker({
            position: origen,
            map: map,
            title: 'Origen',
            icon: 'https://tdinf-uploads.s3.eu-west-1.amazonaws.com/ariadna/map-start-2.png' // taxir.png
        });

        var destinoMarker = new google.maps.Marker({
            position: destino,
            map: map,
            title: 'Destino',
            icon: 'https://tdinf-uploads.s3.eu-west-1.amazonaws.com/ariadna/map-end-2.png' // taxir.png
        });

        var paradaMarkers = paradas.map(function (parada, index) {  
            return new google.maps.Marker({
                position: parada,
                map: map,
                title: 'Parada ' + (index + 1),
                icon: 'https://tdinf-uploads.s3.eu-west-1.amazonaws.com/ariadna/map-stop-2.png' // parada-de-taxi.png
            });
        });

        // Crea una ruta para conectar los puntos
        var directionsService = new google.maps.DirectionsService();
        var directionsRenderer = new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: true
        });

        var waypoints = paradas.map(function (parada) {
            return { location: parada, stopover: true };
        });

        var request = {
            origin: origen,
            destination: destino,
            waypoints: waypoints,
            travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, function (result, status) {
            if (status == 'OK') {
                directionsRenderer.setDirections(result);
            }
        });

    };

    useEffect(() => {
        if (props.datos) renderMap(props.datos)
    }, [props.datos])

    return (
        <>
            {
                props.datos ?
                    <div id="map" style={{ height: '500px' }}></div>
                    :
                    <Typography> Para mostrar el mapa elija al menos el origen y el destino</Typography>
            }

        </>

    )
}

export default MapaRutaDatos