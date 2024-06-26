import React from 'react';
import {
  flexRender,
  HeaderGroup,
  Header,
  Row,
  Cell,
} from '@tanstack/react-table';
import { OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components/';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { SavingsPlanService } from '@/data/api/api.type';
import { SavingsPlanTable, SavingsPlanTableTh } from './Table.type';
import './Table.scss';

function HeaderTableTh({ header }: Readonly<SavingsPlanTableTh>) {
  return (
    <th key={header?.id}>
      {header?.isPlaceholder ? null : (
        <div
          {...(header.id !== 'actions'
            ? {
                onClick: header.column.getToggleSortingHandler(),
                onKeyDown: header.column.getToggleSortingHandler(),
              }
            : {})}
          {...{
            className: header.column.getCanSort()
              ? 'cursor-pointer !justify-start	select-none '
              : '',
          }}
        >
          <div className="text-left">
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_TEXT_SIZE._500}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </OsdsText>
          </div>
          {{
            asc: (
              <div className="relative">
                <div className="absolute top-[2px]">
                  <OsdsIcon
                    color={ODS_THEME_COLOR_INTENT.text}
                    name={ODS_ICON_NAME.SORT_UP}
                    size={ODS_ICON_SIZE.sm}
                  />
                </div>
              </div>
            ),
            desc: (
              <div className="relative">
                <div className="absolute top-[-7px]">
                  <OsdsIcon
                    color={ODS_THEME_COLOR_INTENT.text}
                    name={ODS_ICON_NAME.SORT_DOWN}
                    size={ODS_ICON_SIZE.sm}
                  />
                </div>
              </div>
            ),
          }[header.column.getIsSorted() as string] ?? null}
        </div>
      )}
      {header?.column.getCanResize() && (
        <div
          onKeyDown={header.getResizeHandler()}
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          className={`resizer ${
            header.column.getIsResizing() ? 'isResizing' : ''
          }`}
        ></div>
      )}
    </th>
  );
}

function TableComponent({ table }: Readonly<SavingsPlanTable>) {
  return (
    <table className="manager-table w-full" cellSpacing={0}>
      <thead>
        {table
          .getHeaderGroups()
          .map((headerGroup: HeaderGroup<SavingsPlanService>) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(
                (header: Header<SavingsPlanService, unknown>) => (
                  <HeaderTableTh key={header.id} header={header} />
                ),
              )}
            </tr>
          ))}
      </thead>
      <tbody>
        {table?.getRowModel().rows.map((row: Row<SavingsPlanService>) => (
          <tr key={row.id}>
            {row
              .getVisibleCells()
              .map((cell: Cell<SavingsPlanService, unknown>) => (
                <td key={cell.id}>
                  <div className="text-left">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </td>
              ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableComponent;
