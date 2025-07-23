import { useFormik } from 'formik';
import React, { useContext, useState } from 'react'
import { Button, Grid, TextField } from '@mui/material';

import { LoginCabecera } from './LoginCabecera';
import './LoginPagina.css'

import { GeneralCtx } from '../../contextos/GeneralContext'
import { MensajeError } from '../../utilidades/TratamientoErrores'
import { ErrorGeneral } from '../../componentes/ErrorGeneral/ErrorGeneral';
import { MensajeInformativo } from '../../componentes/MensajeInformativo/MensajeInformativo';
import { useNavigate } from 'react-router-dom';
import { validationSchema } from './LoginFunciones'
import { loginUsuario } from '../../servicios/Trabajadores';


export const LoginForm = () => {
    const { setSession } = useContext(GeneralCtx)
    const [hayError, setHayError] = useState(false)
    const [mensajeError, setMensajeError] = useState('')
    const [hayMensaje, setHayMensaje] = useState(false)
    const [mensaje] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (values) => {
        try {
            console.log('Submit', values)
            const { data: loginData } = await loginUsuario(values)
            //const {data: empresaData} = await leerEmpresa()
            setSession([], loginData)
            navigate('/inicio')
        } catch (error) {
            setMensajeError(MensajeError(error))
            setHayError(true)
        }
    }
    const formik = useFormik({
        initialValues: {
            usuario: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <LoginCabecera />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="usuario"
                            name="usuario"
                            label="Usuario"
                            value={formik.values.usuario}
                            onChange={formik.handleChange}
                            error={formik.touched.usuario && Boolean(formik.errors.usuario)}
                            helperText={formik.touched.usuario && formik.errors.usuario}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.pin && Boolean(formik.errors.password)}
                            helperText={formik.touched.pin && formik.errors.password}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button color="primary" variant="contained" fullWidth type="submit">
                            Entrar
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <ErrorGeneral hayError={hayError} mensajeError={mensajeError} cerrarError={() => setHayError(false)} />
            <MensajeInformativo hayMensaje={hayMensaje} mensaje={mensaje} cerrarMensaje={() => setHayMensaje(false)} />
        </div>
    )
}