import { Pagination as OdsPagination } from '@ovhcloud/ods-react';

import { PaginationProps } from '@/components';

export const Pagination = (props: PaginationProps) => (
  <OdsPagination {...props} />
);
