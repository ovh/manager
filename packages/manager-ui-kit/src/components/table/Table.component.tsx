import { Table as OdsTable } from '@ovhcloud/ods-react';

import { TableProps } from '@/components';

export const Table = ({ children, ...others }: TableProps) => (
  <OdsTable {...others}>{children}</OdsTable>
);
