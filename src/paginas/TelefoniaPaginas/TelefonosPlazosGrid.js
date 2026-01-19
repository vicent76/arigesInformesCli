import { DataGrid } from '@mui/x-data-grid';

export default function TelefonosPlazosGrid({ datosTelefonos }) {

    const columns = [
        { field: 'codclien', headerName: 'Cliente', width: 100 },
        { field: 'nomclien', headerName: 'Nombre', flex: 1.3 },
        { field: 'IdTelefono', headerName: 'Teléfono', width: 130 },
        { field: 'operadorNombre', headerName: 'Operador', width: 110 },
        { field: 'modeloNombre', headerName: 'Modelo', flex: 1.2 },
        {
            field: 'PlazosMeses',
            headerName: 'Meses',
            width: 90,
            type: 'number',
            align: 'right',
            headerAlign: 'right'
        },
        {
            field: 'ImportePlazo',
            headerName: '€/Mes',
            width: 110,
            type: 'number',
            align: 'right',
            headerAlign: 'right',
            renderCell: (params) => (
                <span style={{ color: params.value < 0 ? 'red' : 'inherit' }}>
                    {params.value.toFixed(2)} €
                </span>
            )
        },
        { field: 'PlazosOrigen', headerName: 'Origen', width: 90 },
        {
            field: 'Observaciones',
            headerName: 'Observaciones',
            flex: 2,
            renderCell: (params) => (
                <div style={{ whiteSpace: 'pre-line' }}>{params.value}</div>
            )
        }
    ];

    return (
        <div style={{ height: '100%', width: '100%', backgroundColor: 'white' }}>
            <DataGrid
                rows={datosTelefonos}
                columns={columns}
                pageSize={15}
                rowsPerPageOptions={[15, 30, 50]}
                pagination
                density="compact"
                disableRowSelectionOnClick
                sx={{
                    '& .MuiDataGrid-columnHeaders': {
                        color: '#1976d2',
                        fontSize: 16,
                        fontWeight: 'bolder'
                    }
                }}
            />

        </div>
    );
}
