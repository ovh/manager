import React, { PropsWithChildren } from 'react';
import style from './table.module.scss';

export type TableProps = PropsWithChildren<{
  fullWidth?: boolean;
  cellSpacing?: number;
}>;

export const Table: React.FC<TableProps> = ({
  children,
  fullWidth = false,
  cellSpacing = 0,
}) => (
  <table
    className={`${style.table} ${fullWidth ? 'w-full' : ''}`}
    cellSpacing={cellSpacing}
  >
    {children}
  </table>
);
