import { DataGrid } from '@mui/x-data-grid';


export default function TelefonosPlazosGrid({ datosTelefonos }) {

    const columns = [
        { field: 'codclien', headerName: 'Cliente', width: 100 },
        { field: 'nomclien', headerName: 'Nombre', flex: 1.3 },
        { field: 'IdTelefono', headerName: 'Teléfono', width: 130 },
        { field: 'modeloNombre', headerName: 'Modelo', flex: 1.2 },
        { field: 'operadorNombre', headerName: 'Operador', width: 110 },

        {
            field: 'PlazosOrigen',
            headerName: 'Plazos',
            width: 90,
            type: 'number',
            align: 'right',
            headerAlign: 'right',
        },
        {
            field: 'ImportePlazo',
            headerName: 'Cuota',
            width: 110,
            type: 'number',
            align: 'right',
            headerAlign: 'right',
            renderCell: (params) => (
                <span style={{ color: params.value < 0 ? 'red' : 'inherit' }}>
                    {params.value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                </span>
            )
        },
        {
            field: 'PlazosMeses',
            headerName: 'Pagados',
            width: 90,
            type: 'number',
            align: 'right',
            headerAlign: 'right'
        },
        {
            field: 'CuotasPendientes',
            headerName: 'Pendientes',
            width: 90,
            type: 'number',
            align: 'right',
            headerAlign: 'right'
        },

        {
            field: 'ImportePendiente',
            headerName: 'Imp. pendiente',
            width: 130,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params) => (
                <span style={{ color: params.value < 0 ? 'red' : 'inherit' }}>
                     {params.value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                </span>
            )
        },
        {
            field: 'Observaciones',
            headerName: 'Observaciones',
            flex: 2,
            renderCell: (params) => (
                <div
                    style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        textAlign: 'justify',
                        lineHeight: 1.4,

                    }}
                >
                    {params.value}
                </div>
            )
        }

    ];

    const totalRow = {
        id: 'total',
        codclien: 'Total',
        PlazosOrigen: datosTelefonos.reduce((sum, r) => sum + (r.PlazosOrigen || 0), 0),
        ImportePlazo: datosTelefonos.reduce((sum, r) => sum + (r.ImportePlazo || 0), 0),
        CuotasPendientes: datosTelefonos.reduce((sum, r) => sum + (r.CuotasPendientes || 0), 0),
        ImportePendiente: datosTelefonos.reduce((sum, r) => sum + (r.ImportePendiente || 0), 0),
    };

    const rowsWithTotal = [...datosTelefonos, totalRow];

    return (
        <div style={{ width: '100%', backgroundColor: 'white' }}>
            <DataGrid
                rows={rowsWithTotal}
                columns={columns}
                density="compact"
                pagination={false}      // sin paginación
                hideFooter={true}       // oculta footer
                autoHeight={true}        // ajusta altura al contenido
                getRowClassName={(params) =>
                    params.id === 'total' ? 'MuiDataGrid-row--total' : ''
                }
                sx={{
                    '.MuiDataGrid-columnHeaders': {
                        color: '#1723d4',
                        backgroundColor: '#d5dce0ff',
                        borderBottom: '3px solid #90caf9',
                    },
                    '.MuiDataGrid-columnHeaderTitle': {
                        fontWeight: 600,
                        fontSize: 16,
                        letterSpacing: 0.5,
                    },
                    '.MuiDataGrid-row': {
                        backgroundColor: '#f9f9f9',
                        '&:nth-of-type(even)': {
                            backgroundColor: '#e3f2fd',
                        },
                    },
                    '.MuiDataGrid-row:hover': {
                        backgroundColor: '#bbdefb',
                    },
                    '.MuiDataGrid-row.Mui-selected': {
                        backgroundColor: '#90caf9 !important',
                        color: '#fff',
                    },
                    '.MuiDataGrid-cell': {
                        alignItems: 'flex-start',
                    },
                    '.MuiDataGrid-row--total': {
                        fontWeight: 'bold',
                        backgroundColor: '#e0e0e0',
                    }
                }}
            />
        </div>

    );
}
