export const getSession = () => {
  const getCookie = (c_name) => {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const [name, value] = cookies[i].trim().split("=");
      if (name === c_name) return decodeURIComponent(value);
    }
    return null;
  };

  let empresa = getCookie("arpw_empresa");
  if (empresa) empresa = JSON.parse(empresa);
  else return null;

  let usuario = getCookie("arpw_usuario");
  if (usuario) usuario = JSON.parse(usuario);
  else return null;

  return { empresa, usuario };
};
