import axios from 'axios'
import Entorno from './Entorno'

export const leerClientes = () => {
    const ent = Entorno.gentEnv()
    const url_base = ent.API_URL
    const url = `${url_base}/api/clientes`
    return axios.get(url)
}

