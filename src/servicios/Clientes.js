import axios from 'axios'
import Entorno from './Entorno'
import { getSession } from '../utils/sesion';


export const leerCliente = async (codclien) => {
    const sesion = getSession();
    const empresa = sesion.empresa.ariges;
    const ent = Entorno.gentEnv()
    const url_base = ent.API_URL
    const url = `${url_base}/api/clientes/codigo/${codclien}/${empresa}`
    let result = await axios.get(url);
    return result.data[0];
}


//TELEFONOS
export const leerTelefonos = () => {
    const sesion = getSession();
    const empresa = sesion.empresa.ariges;
    const ent = Entorno.gentEnv()
    const url_base = ent.API_URL
    const url = `${url_base}/api/clientes/telefonos/${empresa}`
    return axios.get(url)
}


export const leerTelefonosVencidos = () => {
    const sesion = getSession();
    const empresa = sesion.empresa.ariges;
    const ent = Entorno.gentEnv()
    const url_base = ent.API_URL
    const url = `${url_base}/api/clientes/telefonos/vencidos/${empresa}`
    return axios.get(url)
}