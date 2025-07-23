import axios from 'axios'
import Entorno from './Entorno'

export const leerVariedades = () => {
    const ent = Entorno.gentEnv()
    const url_base = ent.API_URL
    const url = `${url_base}/api/variedades`
    return axios.get(url)
}

export const leerVariedadesProducto = (codprodu) => {
    const ent = Entorno.gentEnv()
    const url_base = ent.API_URL
    const url = `${url_base}/api/variedades/${codprodu}`
    return axios.get(url)
}

