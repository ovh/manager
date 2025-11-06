import { Table as OdsTable } from '@ovhcloud/ods-react';

import { TableProps } from '@/components/table/Table.props';

export const Table = ({ children, ...others }: TableProps) => (
  <OdsTable {...others}>{children}</OdsTable>
);
