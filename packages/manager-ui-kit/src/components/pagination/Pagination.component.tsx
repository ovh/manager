import { Pagination as OdsPagination } from '@ovhcloud/ods-react';

import { PaginationProps } from '@/components/pagination/Pagination.props';

export const Pagination = (props: PaginationProps) => <OdsPagination {...props} />;
