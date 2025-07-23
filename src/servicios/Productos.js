import axios from 'axios'
import Entorno from './Entorno'

export const leerProductos = () => {
    const ent = Entorno.gentEnv()
    const url_base = ent.API_URL
    const url = `${url_base}/api/productos`
    return axios.get(url)
}

export const leerProductosVariedad = (codvarie) => {
    const ent = Entorno.gentEnv()
    const url_base = ent.API_URL
    const url = `${url_base}/api/productos/${codvarie}`
    return axios.get(url)
}

