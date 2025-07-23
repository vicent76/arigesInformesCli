import axios from 'axios'
import Entorno from './Entorno'

export const leerDatos = (data) => {
    const ent = Entorno.gentEnv()
    const url_base = ent.API_URL
    const url = `${url_base}/api/comparativa`
    return axios.post(url, data)
}

