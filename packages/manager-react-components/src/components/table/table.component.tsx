import React, { PropsWithChildren } from 'react';
import { OdsTable } from '@ovhcloud/ods-components/react';

export type TableProps = PropsWithChildren<{
  fullWidth?: boolean;
  cellSpacing?: number;
}>;

export const Table: React.FC<TableProps> = ({
  children,
  fullWidth = false,
  cellSpacing = 0,
}) => (
  <OdsTable>
    <table className={`${fullWidth ? 'w-full' : ''}`} cellSpacing={cellSpacing}>
      {children}
    </table>
  </OdsTable>
);
