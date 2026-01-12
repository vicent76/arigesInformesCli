import { GeneralContext } from './contextos/GeneralContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Route, Routes } from "react-router-dom"
import LoginPagina from './paginas/LoginPagina/LoginPagina';
import { InicioPagina } from './paginas/InicioPagina/InicioPagina';


//
import ComparativasPagina from './paginas/ComparativaPaginas/ComparativasPagina';
import TelefonosPagina from './paginas/TelefoniaPaginas/TelefonosPagina';


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
            <Route path="/telefonia" element={<TelefonosPagina />} />

          </Routes>
          <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
        </QueryClientProvider>
      </GeneralContext>
    </>
  );
}

export default App;
