import axios from 'axios'
import Entorno from './Entorno'

export const loginUsuario = (data) => {
    const ent = Entorno.gentEnv()
    const url_base = ent.API_URL
    const url = `${url_base}/api/usuarios/login`
    return axios.post(url, data)
}

export const leerFichajesTrabajadorCorto = (codigo) => {
    const ent = Entorno.gentEnv()
    const url_base = ent.API_URL
    const url = `${url_base}/api/usuarios/fichajes_corto/${codigo}`
    return axios.get(url)
}

export const leerFichajesTrabajadorAgrupado = (codigo) => {
    const ent = Entorno.gentEnv()
    const url_base = ent.API_URL
    const url = `${url_base}/api/usuarios/fichajes_agrupado/${codigo}`
    return axios.get(url)
}

export const leerFichajesFecha = (codigo, fecha) => {
    const ent = Entorno.gentEnv()
    const url_base = ent.API_URL
    const url = `${url_base}/api/usuarios/fichajes_fecha/${codigo}/${fecha}`
    return axios.get(url)
}

export const crearFichaje = (data) => {
    const ent = Entorno.gentEnv()
    const url_base = ent.API_URL
    const url = `${url_base}/api/usuarios/fichajes`
    return axios.post(url, data)
}

export const leerFichaje = (secuencia) => {
    const ent = Entorno.gentEnv()
    const url_base = ent.API_URL
    const url = `${url_base}/api/usuarios/fichajes_unico/${secuencia}`
    return axios.get(url)
}
