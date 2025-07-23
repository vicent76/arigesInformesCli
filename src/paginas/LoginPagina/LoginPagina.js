import { Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { LoginForm } from './LoginForm'
import './LoginPagina.css'
import { leerVersion } from '../../servicios/ApiLib'
import { ErrorGeneral } from '../../componentes/ErrorGeneral/ErrorGeneral'
import { MensajeInformativo } from '../../componentes/MensajeInformativo/MensajeInformativo'
import { MensajeError } from '../../utilidades/TratamientoErrores'

export default function LoginPagina() {
    const [version, setVersion] = useState('0.0.0')
    const [hayError, setHayError] = useState(false)
    const [mensajeError, setMensajeError] = useState('')
    const [hayMensaje, setHayMensaje] = useState(false)
    const [mensaje, setMensaje] = useState('')
    const consultarVersion = async () => {
        try {
            const { data: versionData } = await leerVersion()
            setVersion(versionData.version)
        } catch (error) {
            setMensajeError(MensajeError(error))
            setHayError(true)
        }

    }
    useEffect(() => {
        consultarVersion()
    }, [])
    return (
        <>
            <Grid container className='fondoImagenLogin'>
                <Grid item xs={12} md={12} className='cololetra'>
                    <Typography variant='h3'>
                        Ariges Informes
                    </Typography>
                    <Typography variant='h6'>
                        Gestión Comercial
                    </Typography>
                    <Typography>
                        VRS {version}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={12} className="loginForm">
                    <Grid container>
                        <Grid item xs={0} md={8}></Grid>
                        <Grid item xs={12} md={4}>
                            <div className='recuadro'>
                                <LoginForm />
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <ErrorGeneral hayError={hayError} mensajeError={mensajeError} cerrarError={() => setHayError(false)} />
            <MensajeInformativo hayMensaje={hayMensaje} mensaje={mensaje} cerrarMensaje={() => setHayMensaje(false)} />
        </>
    )
}
