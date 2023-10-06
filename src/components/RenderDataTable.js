import * as React from 'react';
import {DataGrid} from '@mui/x-data-grid';

export default function RenderDataTable({columns, data}) {

    if (!data) {
        return null;
    }

    return<div className={"dataContainer"} style={{width:"75%", margin:"auto", marginTop:"25px"}}>
        <DataGrid
            rows={data}
            columns={columns}
            initialState={{
                pagination: {
                    paginationModel: {page: 0, pageSize: 10},
                },
            }}
            getRowId={row => row.Rank}
            pageSizeOptions={[5, 10, 25, 50]}
        />
    </div>
}
