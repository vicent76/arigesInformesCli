import { GeneralContext } from './contextos/GeneralContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Route, Routes } from "react-router-dom"
import LoginPagina from './paginas/LoginPagina/LoginPagina';
import { InicioPagina } from './paginas/InicioPagina/InicioPagina';


//
import ComparativasPagina from './paginas/ComparativaPaginas/ComparativasPagina';
import TelefonosPlazosPagina from './paginas/TelefoniaPaginas/TelefonosPlazosPagina';
import TelefonosVencidosPagina from './paginas/TelefoniaPaginas/TelefonosVencidosPagina';
import { ClientePagina } from './paginas/clientesPagina/ClientePagina';

const queryClient = new QueryClient()

function App() {
  return (
    <>
      <GeneralContext>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path='/' element={<LoginPagina />} />
            <Route path="/inicio" element={<InicioPagina />} />
            <Route path="/comparativa" element={<ComparativasPagina />} />
            <Route path="/telefonosPlazos" element={<TelefonosPlazosPagina />} />
            <Route path="/telefonosVencidos" element={<TelefonosVencidosPagina />} />
            <Route path="/clientes" element={<ClientePagina />} />

          </Routes>
          <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
        </QueryClientProvider>
      </GeneralContext>
    </>
  );
}

export default App;
