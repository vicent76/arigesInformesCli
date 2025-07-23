import { Typography } from '@mui/material';
import React, { useEffect } from 'react'


const MapaRuta = (props) => {
    const renderMap = () => {
        const google = window.google;
        const map = new google.maps.Map(document.getElementById('map'), {
            zoom: 7,
            center: props.direcciones.routes[0].legs[0].start_location,
        });
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({
            map: map,
        });
        const waypoints = [];

        props.direcciones.routes[0].legs.forEach((leg) => {
            waypoints.push(leg.end_location)
        });

        directionsService.route(
            {
                origin: props.direcciones.routes[0].legs[0].start_location,
                destination: props.direcciones.routes[0].legs[0].end_location,
                waypoints: waypoints.map((w) => ({ location: w, stopover: true })),
                travelMode: google.maps.TravelMode.DRIVING,
                provideRouteAlternatives: false
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(result);
                } else {
                    console.error(`error fetching props.direcciones ${result}`);
                }
            }
        );
    };

    useEffect(() => {
        if (props.direcciones) renderMap()
    }, [props.direcciones])

    return (
        <>
            {
                props.direcciones ?
                    <div id="map" style={{ height: '500px' }}></div>
                    :
                    <Typography> Para mostrar el mapa elija al menos el origen y el destino</Typography>
            }

        </>

    )
}

export default MapaRuta