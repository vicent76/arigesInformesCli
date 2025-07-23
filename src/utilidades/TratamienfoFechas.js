const moment = require('moment-timezone');
export const FormatoFechaEs = (fechaMysql) => {
    if (!fechaMysql) return ''
    const dateInUTC = moment.utc(fechaMysql);
    const dateInLocal = dateInUTC.local('Europe/Madrid');
    return dateInLocal.format('DD/MM/YYYY HH:mm:ss')
}

export const FormatoFechaEs2 = (fechaMysql) => {
    if (!fechaMysql) return ''
    const dateInUTC = moment.utc(fechaMysql);
    const dateInLocal = dateInUTC.local('Europe/Madrid');
    return dateInLocal.toISOString();
}

export const FormatoFechaCortaEs = (fechaMysql) => {
    if (!fechaMysql) return ''
    const dateInUTC = moment.utc(fechaMysql);
    const dateInLocal = dateInUTC.local('Europe/Madrid');
    return dateInLocal.format('DD/MM/YYYY')
}

export const FormatoHoraCortaEs = (fechaMysql) => {
    if (!fechaMysql) return ''
    const dateInUTC = moment.utc(fechaMysql, 'HH:mm:ss');
    const dateInLocal = dateInUTC.local('Europe/Madrid');
    return dateInLocal.format('HH:mm')
}

export const ConvertirAFechaEs = (fechaMysql) => {
    const dateInUTC = moment.utc(fechaMysql);
    const dateInLocal = dateInUTC.local('Europe/Madrid');
    return dateInLocal.format()
}

export const FechaContinuaISO = (fechaMysql) => {
    const dateInUTC = moment.utc(fechaMysql);
    const dateInLocal = dateInUTC.local('Europe/Madrid');
    return dateInLocal.format('YYYYMMDDHHmmss')
}

export const FechaLocalES = () => {
    const dateInUTC = moment.utc();
    const dateInLocal = dateInUTC.local('Europe/Madrid');
    return dateInLocal
}

export const FormatoFechaEsAlfa = (fechaMysql) => {
    const dateInUTC = moment.utc(fechaMysql);
    const dateInLocal = dateInUTC.local('Europe/Madrid');
    return  dateInLocal.format('YYYY-MM-DDTHH:mm:ssZ')
}