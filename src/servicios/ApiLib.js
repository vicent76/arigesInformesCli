import axios from 'axios'
import Entorno from './Entorno'

export const leerVersion = () => {
    const ent = Entorno.gentEnv()
    const url_base = ent.API_URL
    const url = `${url_base}/api/version`
    return axios.get(url)
}
