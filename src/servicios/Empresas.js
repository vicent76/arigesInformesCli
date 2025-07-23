import axios from 'axios'
import Entorno from './Entorno'

export const leerEmpresa = (data) => {
    const ent = Entorno.gentEnv()
    const url_base = ent.API_URL
    const url = `${url_base}/api/empresas`
    return axios.get(url)
}

