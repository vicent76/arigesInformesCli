import axios from 'axios'
import Entorno from './Entorno'
import { getSession } from '../utils/sesion';

export const leerDatos = (data) => {
    const sesion = getSession();
    const empresa = sesion.empresa.ariges;
    const ent = Entorno.gentEnv()
    const url_base = ent.API_URL
    const url = `${url_base}/api/comparativa/${empresa}`
    return axios.post(url, data)
}

