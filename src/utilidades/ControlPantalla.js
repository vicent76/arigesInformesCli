export const TipoPantalla = () => {
    let disp = 'desktop'
    if (window.innerWidth < 768) {
        // console.log("Estás en un dispositivo móvil");
        disp = 'mobile'
    } else if (window.innerWidth < 992) {
        // console.log("Estás en una tablet");
        disp = 'tablet'
    } else {
        // console.log("Estás en un equipo desktop");
        disp = 'desktop'
    }
    return disp
}