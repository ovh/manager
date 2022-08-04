import React from 'react';
import { useTranslation } from 'react-i18next';
import { HStack, Select, Text } from '@chakra-ui/react';

import Pagination, { PaginationDisplayMode } from './Pagination';

export type ListingPaginationProps = {
  currentPage: number;
  pageSize: number;
  itemsCount: number;
  availablePageSize?: number[];
  onChange: (currentPage: number, pageSize: number) => void;
};

export default function ListingPagination({
  currentPage,
  pageSize,
  itemsCount,
  availablePageSize = [10, 25, 50, 100, 300],
  onChange,
}: ListingPaginationProps): JSX.Element {
  const { t } = useTranslation('common');
  const pageCount = Math.ceil(itemsCount / pageSize);

  const pageChangeHandler = (page: number) => {
    onChange(Math.min(page, Math.ceil(itemsCount / pageSize)), pageSize);
  };

  const pageSizeChangeHandler = (size: number) => {
    onChange(Math.min(currentPage, Math.ceil(itemsCount / size)), size);
  };

  return (
    <HStack>
      {itemsCount > availablePageSize[0] && (
        <>
          <Select
            w="auto"
            value={pageSize}
            onChange={(e) => pageSizeChangeHandler(Number(e.target.value))}
          >
            {availablePageSize.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Select>
          <Text>{t('of_results', { count: itemsCount })}</Text>
        </>
      )}
      {itemsCount < availablePageSize[0] && (
        <Text>{t('n_results', { count: itemsCount })}</Text>
      )}
      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={pageChangeHandler}
        displayMode={
          pageCount > 5
            ? PaginationDisplayMode.SelectMode
            : PaginationDisplayMode.ButtonMode
        }
      />
    </HStack>
  );
}
