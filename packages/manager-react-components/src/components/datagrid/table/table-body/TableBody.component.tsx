import { flexRender } from '@tanstack/react-table';
import { TableBodyProps } from './TableBody.props';

export const TableBody = <T,>({ rowModel }: TableBodyProps<T>) => {
  return (
    <tbody>
      {rowModel?.rows.map((row) => (
        <tr key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};
