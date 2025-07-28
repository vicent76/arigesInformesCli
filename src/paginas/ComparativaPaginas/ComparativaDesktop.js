import React, { useEffect, useRef } from 'react';
import { Typography } from '@mui/material';

export default function ComparativaDesktop({ datosComparativa }) {

  const reportRef = useRef(null);
  const hasRendered = useRef(false);
  
 
  


  useEffect(() => {
    if (!datosComparativa || datosComparativa.length < 2) {
      return; // Si no hay suficientes datos, no hace nada
    }


// Usamos requestAnimationFrame para esperar hasta que el panel se haya montado
/* const movePanelToRight = () => {
  const reportPanel = document.querySelector('#StiViewerReportPanel');
  if (reportPanel) {
    // Cambiar las propiedades para mover el panel hacia la derecha
    reportPanel.style.position = 'absolute';
    reportPanel.style.right = '0'; // Desplaza el panel a la derecha
    reportPanel.style.top = '105px'; // Mantiene la posición de top que ya tenía
    reportPanel.style.marginTop = '0';
    reportPanel.style.overflow = 'auto';
  } else {
    // Si el panel aún no se ha creado, intentamos de nuevo en el siguiente ciclo
    requestAnimationFrame(movePanelToRight);
  }
};

// Llamamos a la función para mover el panel
requestAnimationFrame(movePanelToRight);
 */
  if (hasRendered.current) return; // Evita múltiples ejecuciones

  let STI_KEY = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHmdDoZinxw82gXdfpNeKsa0iy3Xro1lEo20e+MLfk+OKYUzWlNppaVKtAQE9SwlWpW+sdm0zF+U4aC3U5bJqNVT8XNjDqzk6e4Fx4SaTx4pBnD1USxGkYjLCgGc8OEpZqhepOwyHN2t5lE6ZbkZUidXfrKEaZgGuDh55Nd99E1dMFjXOvmkFPABROQIgwhDSU4ikRxVlQP9P6tPf8ZbRfmmascguce5L9dAeerR67l3IQInHQKpWt92WE1/si83VWoEzH8Fe3nj2MV6mB+rrHcyXSUwRduMYuLVpw+5Kkv2Y6WXbs6HPSnxScq/N7DJntqnAurKCcTO0Hw+pX1pJMiuHQXPNsfq3TQCD0PLZcArqkMH4B/Vdqw4NscNHdsa7nz2oJOal+535YX35i1eAGrO3b7jZrvMMzyP87yFJ+vJi0kQ065gpJAmGVSyqYStE2CzS6O2XXHIvCztdg2jnbu+bfb8etIf6RP/KGQsekmdWVouJFq7RVVXN2zuIcH4YWjvsIIqc/G6i5lGtDc81VqL";
  // Configuración de Stimulsoft Viewer
  window.Stimulsoft.Base.StiLicense.key = STI_KEY
  let options = new window.Stimulsoft.Viewer.StiViewerOptions();
  options.appearance.scrollbarsMode = true;
  options.appearance.fullScreenMode = false;
  options.toolbar.showSendEmailButton = false;
  options.toolbar.showPrintButton = true; // Habilita el botón de impresión
  options.toolbar.showSaveButton = true;  // Habilita el botón de guardado


  let viewer = new window.Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
  let file = "/reports/Comparativa.mrt";
  let report = new window.Stimulsoft.Report.StiReport();
  report.loadFile(file);

    

  // Prepara los datos para el reporte
  let datos = prepararDatos(datosComparativa);
  let jsonString = JSON.stringify( datos );
  let dataSet = new window.Stimulsoft.System.Data.DataSet("Comparativa");
  dataSet.readJson(jsonString);
  // Remove all connections from the report template
  report.dictionary.databases.clear();

  // Asigna el DataSet al reporte
  report.regData(dataSet.dataSetName, "", dataSet);
  report.dictionary.synchronize();

  // Renderiza el reporte en el visor
  viewer.report = report;
  viewer.renderHtml("reportContainer");

  const elements = document.getElementsByClassName('stiJsViewerForm');
  if (elements.length > 0) {
    const element = elements[0]; // Seleccionar el primer elemento con esta clase
    Object.assign(element.style, {
      backgroundColor: 'aliceblue',
      position: 'relative',
      zIndex: 11,
      fontSize: '12px',
      left: '444px',
      top: '12px',
      opacity: '1',
      width: '30%',
    });
  }

  
  
const elements2 = document.getElementsByClassName('stiJsViewerMenu');
if (elements2.length > 0) {
  for( let i = 0; i < elements2.length; i++) {
    const element2 = elements2[i]; // Seleccionar el primer elemento con esta clase
    Object.assign(element2.style, {
      zIndex: 11,
      position: 'relative',
      width: '184px',
      height: 'auto',
      overflow: 'visible',
      top: '11px',
      opacity: '1',
      backgroundColor: 'aliceblue'
    });
  }
} 
  
/* // Ejecuta tu código personalizado
setTimeout(() => {
  const elements3 = document.getElementsByClassName('stiJsViewerToolTip');
  if (elements3.length > 0) {
    for( let i = 0; i < elements3.length; i++) {
      const elements3 = elements3[i]; // Seleccionar el primer elemento con esta clase
      Object.assign(elements3.style, {
        zIndex: 11,
        position: 'relative',
        width: '184px',
        height: 'auto',
        overflow: 'visible',
        top: '11px',
        opacity: '1',
        backgroundColor: 'aliceblue'
      });
    }
  } 
}, 50000);
 */
      
  console.log("Se ejecuta solo una vez al montar el componente");
  hasRendered.current = true;
}, [datosComparativa]);

const prepararDatos = (datosComparativa) => {
  const empresaPrincipal = datosComparativa[0];
  const empresasComparadas = datosComparativa.slice(1);

  const datosReporte = [];
  let obj = {
    tresEmpresas: false
  };

  // Usamos Set para obtener variedades únicas de todas las empresas
  const variedadesUnicas = [
    ...new Map(
      empresaPrincipal.datos.concat(
        ...empresasComparadas.map((empresa) => empresa.datos || [])
      ).map((variedad) => [variedad.codvarie, variedad])
    ).values(),
  ];

  // Agrupar por codprodu
  const grupoPorCodprodu = {};

  variedadesUnicas.forEach((variedadUnica) => {
    // Empresa principal
    const variedadPrincipal = empresaPrincipal.datos.find(
      (v) => v.codvarie === variedadUnica.codvarie
    );

    let principalData = {
      cliente: variedadUnica.nomclien,
      filtoVariedad: variedadUnica.filtoVariedad,
      producto: variedadUnica.nomprodu || 'Producto no disponible',
      variedad: variedadUnica.nomvarie || 'Variedad no disponible',
      codempre: empresaPrincipal.codempre,
      nomempre: empresaPrincipal.nomempre,
      codprodu: variedadPrincipal?.codprodu,
      codvarie: variedadPrincipal?.codvarie,
      palets: variedadPrincipal?.totpalet || 0,
      cajas: variedadPrincipal?.numcajas || 0,
      pesoNeto: variedadPrincipal?.pesoneto || 0,
      porcentajePalets: 0,
      porcentajeCajas: 0,
      porcentajePesoNeto: 0
    };

    // Empresas comparadas
    if (empresasComparadas.length == 2) obj.tresEmpresas = true;

    // Inicializar la propiedad de grupo por codprodu
    if (!grupoPorCodprodu[principalData.codprodu]) {
      grupoPorCodprodu[principalData.codprodu] = {
        palets: 0,
        cajas: 0,
        pesoNeto: 0
      };
    }
    grupoPorCodprodu[principalData.codprodu].palets += principalData.palets;
    grupoPorCodprodu[principalData.codprodu].cajas += principalData.cajas;
    grupoPorCodprodu[principalData.codprodu].pesoNeto += principalData.pesoNeto;

    empresasComparadas.forEach((empresa, index) => {
      const variedadComparada = empresa.datos.find(
        (v) => v.codvarie === variedadUnica.codvarie
      );

      const porcentaje = (base, valor) =>
        base !== 0
          ? Math.round(((valor - base) / base) * 100 * 100) / 100
          : valor !== 0
          ? 100
          : 0;

      principalData[`codempre${index + 1}`] = empresa.codempre;
      principalData[`nomempre${index + 1}`] = empresa.nomempre;
      principalData[`palets${index + 1}`] = variedadComparada?.totpalet || 0;
      principalData[`cajas${index + 1}`] = variedadComparada?.numcajas || 0;
      principalData[`pesoNeto${index + 1}`] = variedadComparada?.pesoneto || 0;
      principalData[`porcentajePalets${index + 1}`] = porcentaje(principalData.palets, variedadComparada?.totpalet || 0).toString().replace(/\./g, ',');
      principalData[`porcentajeCajas${index + 1}`] = porcentaje(principalData.cajas, variedadComparada?.numcajas || 0).toString().replace(/\./g, ',');
      principalData[`porcentajePesoNeto${index + 1}`] = porcentaje(principalData.pesoNeto, variedadComparada?.pesoneto || 0).toString().replace(/\./g, ',');

      // Agregar las propiedades booleanas si las sumas son 0
      principalData[`isPaletsZero${index + 1}`] = grupoPorCodprodu[principalData.codprodu].palets === 0;
      principalData[`isCajasZero${index + 1}`] = grupoPorCodprodu[principalData.codprodu].cajas === 0;
      principalData[`isPesoNetoZero${index + 1}`] = grupoPorCodprodu[principalData.codprodu].pesoNeto === 0;
    });

    // Si solo hay una empresa comparada, registrar los valores vacíos para la tercera
    if (empresasComparadas.length == 1) {
      principalData[`codempre${2}`] = 0;
      principalData[`nomempre${2}`] = '';
      principalData[`palets${2}`] = 0;
      principalData[`cajas${2}`] = 0;
      principalData[`pesoNeto${2}`] = 0;
      principalData[`porcentajePalets${2}`] = 0;
      principalData[`porcentajeCajas${2}`] = 0;
      principalData[`porcentajePesoNeto${2}`] = 0;
      principalData[`isPaletsZero${2}`] = grupoPorCodprodu[principalData.codprodu].palets === 0;
      principalData[`isCajasZero${2}`] = grupoPorCodprodu[principalData.codprodu].cajas === 0;
      principalData[`isPesoNetoZero${2}`] = grupoPorCodprodu[principalData.codprodu].pesoNeto === 0;
    }

    datosReporte.push(principalData);
  });

  /* const jsonString = JSON.stringify({ Comparativa: datosReporte, condicion: [obj] }, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'datosReporte.json';
  link.click(); */

  return { Comparativa: datosReporte, condicion: [obj] };
};

  if (!datosComparativa || datosComparativa.length < 2) {
    return (
      <Typography variant="h6" color="textSecondary">
        No hay datos suficientes para comparar.
      </Typography>
    );
  }

  return (
    <div style={{ height: "600px", width: "100%", position: "relative" }}>
      <Typography variant="h4" gutterBottom>
        Comparativa de Empresas
      </Typography>
      <div
        id="reportContainer"
        style={{
          width: "100%",
          height: "100%",
          position: "relative", // Añadir posición relativa
          zIndex: 1, // El reporte tiene un z-index bajo
        }}
        ref={reportRef}
      ></div>
      <div
        id="StiViewer"
        style={{
          position: "relative",
          zIndex: 9999, // El visor debe estar por encima del reporte
        }}
      ></div>
    </div>
  );
  
}
