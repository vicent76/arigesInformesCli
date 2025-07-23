const Entorno = {
    gentEnv: () => {
        // let API_URL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_API_URL : window.API_URL;
        // "http://localhost:8081"
        let API_URL = process.env.NODE_ENV === 'development' ? "http://localhost:8081": window.API_URL;
        API_URL = API_URL || ''
        return {
            API_URL
        }
    }
}
export default Entorno