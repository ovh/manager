import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  Cell,
  Row,
  HeaderGroup,
  Header,
  flexRender,
} from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { Table } from '@ovhcloud/manager-components';
import { OsdsText, OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_SIZE } from '@ovhcloud/ods-components/';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import appConfig from '@/{{appName}}.config';

interface TableContainer {
  readonly data: any[];
  readonly hasNextPage?: boolean;
}

interface DisplayCellText {
  readonly cell?: any;
  readonly header?: Header<any, unknown>;
}

function DisplayCellText({ cell }: DisplayCellText) {
  const myConfig = appConfig;
  const serviceKey = myConfig.listing?.datagrid?.serviceKey;
  const columnDef: string = cell?.column?.columnDef?.header;
  const navigate = useNavigate();
  let label = cell.renderValue() as string;
  if (columnDef === serviceKey) {
    return (
      <OsdsLink
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => navigate(label)}
      >
        {label}
      </OsdsLink>
    );
  }
  if (typeof label === 'object') {
    label = '-';
  }
  return (
    <OsdsText color={ODS_THEME_COLOR_INTENT.text}>{label || '-'}</OsdsText>
  );
}

function HeaderTableTh({ header }: DisplayCellText) {
  return (
    <OsdsText color={ODS_THEME_COLOR_INTENT.text} size={ODS_TEXT_SIZE._500}>
      {flexRender(header.column.columnDef.header, header.getContext())}
    </OsdsText>
  );
}

function TableContainer({ data, hasNextPage = false }: TableContainer) {
  const columns = Object.keys(data[0])
    .filter((element) => element !== 'iam')
    .map((element) => ({
      id: element,
      header: element,
      accessorKey: element,
      cell: DisplayCellText,
    }));
  const table = useReactTable<any>({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  return (
    <div>
      <div>
        <Table fullWidth={true}>
          <thead
            className={
              hasNextPage || data.length > 10 ? 'sticky top-0 z-1 bg-white' : ''
            }
          >
            {table?.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header: Header<any, unknown>) => (
                  <th key={header.id} className="text-center">
                    <HeaderTableTh header={header} />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table?.getRowModel().rows.map((row: Row<any>) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell: Cell<any, unknown>) => (
                  <td key={cell.id} className="text-center">
                    <div>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default TableContainer;
