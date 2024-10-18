import React, { PropsWithChildren } from 'react';

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
    className={`${fullWidth ? 'w-full' : ''} manager-table`}
    cellSpacing={cellSpacing}
  >
    {children}
  </table>
);
