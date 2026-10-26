import React, { useState } from 'react';

import {
    Box,
    Radio,
    RadioGroup,
    FormControlLabel,
    TextField
} from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';

export default function DocumentosCliente() {

    const [tipoDocumento, setTipoDocumento] = useState('ofertas');
    const [documentos, setDocumentos] = useState({
        ofertas: [],
        pedidos: [],
        albaranes: [],
        facturas: []
    });
    //
    const columnasDocumentos = {

        ofertas: [
            { field: 'numero', headerName: 'Nº Oferta', width: 120 },
            { field: 'fecha', headerName: 'Fecha', width: 120 },
            { field: 'fechaentrega', headerName: 'Fecha entrega', width: 120 },
            { field: 'aceptado', headerName: 'Aceptado', width: 120 },
            { field: 'referencia', headerName: 'Referencia', flex: 1 },
            { field: 'importe', headerName: 'Importe', width: 120, type: 'number' }
        ],

        pedidos: [
            { field: 'numero', headerName: 'Nº Pedido', width: 120 },
            { field: 'fecha', headerName: 'Fecha', width: 120 },
            { field: 'cliente', headerName: 'Cliente', flex: 1 },
            { field: 'estado', headerName: 'Estado', width: 140 },
            { field: 'importe', headerName: 'Importe', width: 120, type: 'number' }
        ],

        albaranes: [
            { field: 'numero', headerName: 'Nº Albarán', width: 120 },
            { field: 'fecha', headerName: 'Fecha', width: 120 },
            { field: 'cliente', headerName: 'Cliente', flex: 1 },
            { field: 'importe', headerName: 'Importe', width: 120, type: 'number' }
        ],

        facturas: [
            { field: 'numero', headerName: 'Nº Factura', width: 120 },
            { field: 'fecha', headerName: 'Fecha', width: 120 },
            { field: 'cliente', headerName: 'Cliente', flex: 1 },
            { field: 'base', headerName: 'Base imponible', width: 140, type: 'number' },
            { field: 'iva', headerName: 'IVA', width: 100, type: 'number' },
            { field: 'total', headerName: 'Total', width: 120, type: 'number' }
        ]
    };

    //
    const obtenerFechaHoy = () => {
        const fecha = new Date();

        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };
    const [fecha, setFecha] = useState(obtenerFechaHoy);

    const handleChange = (event) => {
        setTipoDocumento(event.target.value);
    };

    return (
        <><Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #aaa',
                borderRadius: '4px',
                backgroundColor: '#f5f5f5',
                padding: '10px 0px 5px 5px',
                gap: 3
            }}
        >
            <RadioGroup
                row
                value={tipoDocumento}
                onChange={handleChange}
                sx={{
                    gap: 1,

                    '& .MuiFormControlLabel-root': {
                        margin: 0
                    },

                    '& .MuiFormControlLabel-label': {
                        fontSize: '12px'
                    },

                    '& .MuiRadio-root': {
                        padding: '3px',
                        color: '#999',

                        '&.Mui-checked': {
                            color: '#ed7d31'
                        }
                    },

                    '& .MuiSvgIcon-root': {
                        fontSize: 15
                    }
                }}
            >
                <FormControlLabel
                    value="ofertas"
                    control={<Radio />}
                    label="Ofertas" />

                <FormControlLabel
                    value="pedidos"
                    control={<Radio />}
                    label="Pedidos" />

                <FormControlLabel
                    value="albaranes"
                    control={<Radio />}
                    label="Albaranes" />

                <FormControlLabel
                    value="facturas"
                    control={<Radio />}
                    label="Facturas" />
            </RadioGroup>
            <TextField
                label="Desde"
                type="date"
                size="small"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ width: 170 }} />
        </Box>
            <Box
                sx={{
                    width: '100%',
                    height: 450,
                    mt: 2
                }}
            >
                <DataGrid
                    rows={documentos[tipoDocumento]}
                    columns={columnasDocumentos[tipoDocumento]}
                    getRowId={(row) => row.id}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                                page: 0
                            }
                        }
                    }}
                    pageSizeOptions={[10, 25, 50, 100]}
                    disableRowSelectionOnClick
                    density="compact"
                    sx={{
                        backgroundColor: '#fff',

                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },

                        '& .MuiDataGrid-cell': {
                            fontSize: '12px'
                        },

                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: 'bold',
                            fontSize: '12px'
                        }
                    }}
                />
            </Box>
            </>
    );
}