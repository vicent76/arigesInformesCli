import * as yup from 'yup'
import { es } from 'yup-locales'
import { setLocale } from 'yup'

setLocale(es)

export const initialValues = () => {
    return {
        usuario: null,
        password: null,
    }
}

export const validationSchema = () => {
    return yup.object({
        usuario: yup.string('Introduzca su codigo').required('Requerido'),
        password: yup.string('Introduzca su pin').required('Requerido'),
    })
}