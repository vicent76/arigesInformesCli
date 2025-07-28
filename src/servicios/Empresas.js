import axios from 'axios'
import Entorno from './Entorno'

export const leerEmpresa = (codusu) => {
    const ent = Entorno.gentEnv()
    const url_base = ent.API_URL
    const url = `${url_base}/api/empresas/${codusu}`
    return axios.get(url)
}

