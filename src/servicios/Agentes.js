import axios from 'axios'
import Entorno from './Entorno'
import { getSession } from '../utils/sesion';

export const leerAgente = async (codagent) => {
    const sesion = getSession();
    const empresa = sesion.empresa.ariges;
    const ent = Entorno.gentEnv()
    const url_base = ent.API_URL
    const url = `${url_base}/api/agentes/${codagent}/${empresa}`
    let result = await axios.get(url);
    return result.data;
}

