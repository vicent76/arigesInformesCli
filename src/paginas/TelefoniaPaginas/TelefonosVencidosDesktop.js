import React, { useEffect, useRef } from 'react';
import { Typography } from '@mui/material';

export default function TelefonosPlazosDesktop({ datosTelefonos }) {

  const reportRef = useRef(null);
  const hasRendered = useRef(false);





  useEffect(() => {
    let viewer = null;

    if (!datosTelefonos || datosTelefonos.length == 0) {
      return;
    }

    if (!window.Stimulsoft || !window.Stimulsoft.Base) {
      console.log("Stimulsoft aún no está cargado");
      return;
    }

    try {
      // -------------------------------
      // 🔑 LICENCIA Y CONFIGURACIÓN BASE
      // -------------------------------
      //const STI_KEY = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHmdDoZinxw82gXdfpNeKsa0iy3Xro1lEo20e+MLfk+OKYUzWlNppaVKtAQE9SwlWpW+sdm0zF+U4aC3U5bJqNVT8XNjDqzk6e4Fx4SaTx4pBnD1USxGkYjLCgGc8OEpZqhepOwyHN2t5lE6ZbkZUidXfrKEaZgGuDh55Nd99E1dMFjXOvmkFPABROQIgwhDSU4ikRxVlQP9P6tPf8ZbRfmmascguce5L9dAeerR67l3IQInHQKpWt92WE1/si83VWoEzH8Fe3nj2MV6mB+rrHcyXSUwRduMYuLVpw+5Kkv2Y6WXbs6HPSnxScq/N7DJntqnAurKCcTO0Hw+pX1pJMiuHQXPNsfq3TQCD0PLZcArqkMH4B/Vdqw4NscNHdsa7nz2oJOal+535YX35i1eAGrO3b7jZrvMMzyP87yFJ+vJi0kQ065gpJAmGVSyqYStE2CzS6O2XXHIvCztdg2jnbu+bfb8etIf6RP/KGQsekmdWVouJFq7RVVXN2zuIcH4YWjvsIIqc/G6i5lGtDc81VqL";

      const STI_KEY = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHls8V3JNmDvtTNtWgsnqTLSTQA9kHU+i7Bhr91n+/a/O545rRgjtUvMySRt5wxXUHa0L1Wmwnm+4TbbZupELSyooW2JaWQH1Zt/prIfHW2vXrBEpS0mPkPavYMLno8iyeH1NMqm1hWuo4/95pioas2EiCl6i/1S69M7UCQs5KD2/xI5HGzyI035C9G1uq5sgipdgwq7d85RaU1SZbQVmjVyZ1YHN/BJvWIa4vDQ/OdbbAX4vHJf7ws6+ulQJg7NuPGx17NLvWCluFfUCXAaMEf11NWdacedhEPEKT7agCLsd5AcJY2u+4sMPY7xDn0gWGAUXLoqiQ//AevI/uAhLNU+ci9uj9S3wZ4knzbnUH8Se2L7IOiC4nUv9GSlPNsyxG9tAwgm6eEw354y9nxcrPxXbR8wSC4jYcj33eIMpXaptYjaJebbJUtcukcZ9YIChCjQlISNnEcazsig3oVPB76jCqxfRTKcFJ1pdyK7BBORIZ9uhVkI0eSiKwvlqRkW5JYVgShZj90ik625vlQJC3dQ";

      window.Stimulsoft.Base.StiLicense.key = STI_KEY;
      window.Stimulsoft.Base.Localization.StiLocalization.addLocalizationFile("/stireport/Localization/es.xml", true);
      window.Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile("/stireport/Localization/es.xml");

      // -------------------------------
      // ⚙ OPCIONES DEL VISOR
      // -------------------------------
      const options = new window.Stimulsoft.Viewer.StiViewerOptions();
      options.appearance.scrollbarsMode = true;
      options.appearance.fullScreenMode = false;
      options.toolbar.showSendEmailButton = false;
      options.toolbar.showPrintButton = true;
      options.toolbar.showSaveButton = true;

      // -------------------------------
      // 📄 CREAR VISOR Y REPORTE
      // -------------------------------
      // Limpiar contenedor por si acaso
      const container = document.getElementById("reportContainer");
      if (container) container.innerHTML = "";

      viewer = new window.Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
      const report = new window.Stimulsoft.Report.StiReport();
      let file = "/reports/informe_telefonos_vencidos.mrt";
      report.loadFile(file);





      // -------------------------------
      // 🔧 Preparar datos
      // -------------------------------
      // -------------------------------
      // 🔧 Preparar datos
      // -------------------------------
      const datosLimpios = limpiarTelefonos(datosTelefonos);

      // DEBUG: Limitamos a 50 items para probar si es volumen o estructura
      // Si funciona, iremos subiendo.
      // Usamos regData directo evitando el DataSet intermedio y JSON stringify si es posible
      // Pero Stimulsoft JS suele preferir DataSet o JSON.
      // Probemos la vía más directa posible: DataSet con objeto plano.

      const dataSet = new window.Stimulsoft.System.Data.DataSet("Telefonos_vencidos");
      // En lugar de readJson, probamos cargar el objeto directamente si la versión lo permite
      // O mejor, volver a readJson pero asegurando estructura perfecta.

      // INTENTO 3: Simplificar al máximo. Array directo.
      let json = JSON.stringify({ Telefonos: datosLimpios }, null, 2);
      dataSet.readJson(json);
      // Remove all connections from the report template
      report.dictionary.databases.clear();

      // Asigna el DataSet al reporte
      report.regData(dataSet.dataSetName, "", dataSet);
      report.dictionary.synchronize();

      /* const blob = new Blob([json], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'datosReporte.json';
      link.click(); */

      // report.dictionary.synchronize(); // A veces synchronize fuerza la lectura recursiva profunda.
      // Probemos SIN synchronize si el reporte ya tiene la estructura definida.
      // Si el reporte MRT ya espera "Telefonos", no hace falta sincronizar estructura, solo pasar datos.
      // report.dictionary.databases.clear(); // Esto borra la conexión SQL del reporte si la tuviera.

      viewer.report = report;
      viewer.renderHtml("reportContainer");

      const stiViewer = document.getElementById("StiViewer");
      if (stiViewer) {
        stiViewer.style.removeProperty("background");
      }
    } catch (error) {
      console.error("Error al cargar Stimulsoft:", error);
    }

    // CLEANUP FUNCTION
    return () => {
      console.log("Limpiando visor Stimulsoft...");
      if (viewer) {
        try {
          // Intentar destruir/limpiar si la API lo permite, o simplemente vaciar el contenedor
          // viewer.destroy(); // Si existe método destroy
        } catch (e) {
          console.warn("Error limpiando viewer", e);
        }
      }
      const container = document.getElementById("reportContainer");
      if (container) container.innerHTML = "";
    };

  }, [datosTelefonos]);


  // Función estricta para asegurar que no hay referencias cíclicas ni datos extraños
  const limpiarTelefonos = (telefonos) => {
    if (!Array.isArray(telefonos)) return [];

    return telefonos.map(t => {
      // Crear un NUEVO objeto plano explícitamente, sin spread operator (...t)
      return {
        // Campos de texto explícitos
        Observaciones: t.Observaciones ? String(t.Observaciones).replace(/\r\n|\r|\n/g, ' ').normalize('NFC') : '',
        nomclien: t.nomclien ? String(t.nomclien).normalize('NFC') : '',
        modeloNombre: t.modeloNombre ? String(t.modeloNombre).normalize('NFC') : '',
        operadorNombre: t.operadorNombre ? String(t.operadorNombre).normalize('NFC') : '',

        // Campos numéricos explícitos
        ImportePlazo: Number(t.ImportePlazo) || 0,
        PlazosMeses: Number(t.PlazosMeses) || 0,
        PlazosOrigen: Number(t.PlazosOrigen) || 0,

        // Copiar explícitamente otros campos necesarios SI existen en el reporte.
        // Si el reporte usa campos que no están aquí, añádelos explícitamente.
        // Evitamos ...t para prevenir recursión por propiedades heredadas o complejas.
        codclien: t.codclien || 0,
        IdTelefono: t.IdTelefono || '',
        numero: t.numero || '',
        imei: t.imei || '',
        fecha: t.fecha || null, // O formatear si es necesario
      };
    });
  };



  if (!datosTelefonos || datosTelefonos.length < 0) {
    return (
      <Typography variant="h6" color="textSecondary">
        No hay datos suficientes para comparar.
      </Typography>
    );
  }

  return (


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


  );

}
