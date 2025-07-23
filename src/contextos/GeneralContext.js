import React, {createContext} from 'react';

const GeneralCtx = createContext();

const GeneralContext = props => {

    const areCookiesEnabled = () => {
        var cookieEnabled = (navigator.cookieEnabled) ? true : false;
        if (typeof navigator.cookieEnabled === "undefined" && !cookieEnabled) {
            document.cookie = "testcookie";
            cookieEnabled = (document.cookie.indexOf("testcookie") !== -1) ? true : false;
        }
        return (cookieEnabled);
    }
    const setCookie = (c_name, value, exdays) => {
        if (!areCookiesEnabled()) {
            alert("NO COOKIES");
        }
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = encodeURI(value) + ((exdays === null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value;
    }
    const deleteCookie = (c_name) => {
        if (!areCookiesEnabled()) {
            alert("NO COOKIES");
        }
        document.cookie = c_name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    const getCookie = (c_name) => {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x === c_name) {
                return decodeURI(y);
            }
        }
    }

    const setSession = (empresa, usuario, token) => {
        setCookie('arpw_empresa', JSON.stringify(empresa), 1);
        setCookie('arpw_usuario', JSON.stringify(usuario), 1);
        setCookie('arpw_token', token, 1);
    };

    const getSession = () => {
        let empresa = getCookie('arpw_empresa')
        if (empresa) {empresa = JSON.parse(empresa)} else {return null}
        let usuario = getCookie('arpw_usuario')
        if (usuario) {usuario = JSON.parse(usuario)} else {return null}
        let token = getCookie('arpw_token')
        let session = {
            usuario,
            empresa,
            token
        }
        return session;
    };

    const setFiltros = (filtros) => {
        setCookie('arpw_filtros', JSON.stringify(filtros), 1);
    }

    const getFiltros = () => {
        let filtros = getCookie('arpw_filtros')
        if (filtros) filtros = JSON.parse(filtros)
        return filtros
    }

    const deleteSession = () => {
        deleteCookie('arpw_session');
    }

    return (
        <GeneralCtx.Provider value={{
            setSession,
            getSession,
            deleteSession,
            setFiltros,
            getFiltros
        }}> 
            {props.children}
        </GeneralCtx.Provider>
    )
}

export {GeneralContext, GeneralCtx};