import axios from 'axios'
import Entorno from './Entorno'
import { getSession } from '../utils/sesion';

export const leerOfertasCliente = async (codclien) => {
    const sesion = getSession();
    const empresa = sesion.empresa.ariges;
    const ent = Entorno.gentEnv()
    const url_base = ent.API_URL
    const url = `${url_base}/api/ofertas/cliente/${empresa}/${codclien}`
    let result = await axios.get(url);
    return result.data;
}

