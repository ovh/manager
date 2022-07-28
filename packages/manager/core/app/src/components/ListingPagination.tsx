import React from 'react';
import { useTranslation } from 'react-i18next';
import { HStack, Select, Text } from '@chakra-ui/react';

import Pagination, { PaginationDisplayMode } from './Pagination';

export type ListingPaginationProps = {
  currentPage: number;
  itemsCount: number;
  itemsPerPage?: number;
  availablePageSize?: number[];
  onChange: (a: { currentPage: number; itemsPerPage: number }) => void;
};

export default function ListingPagination({
  currentPage,
  itemsCount,
  itemsPerPage = 10,
  availablePageSize = [10, 25, 50, 100, 300],
  onChange,
}: ListingPaginationProps): JSX.Element {
  const { t } = useTranslation('common');
  const pageCount = Math.ceil(itemsCount / itemsPerPage);
  const selectablePageSizes = availablePageSize.slice(
    0,
    availablePageSize.findIndex((size) => size >= itemsCount) + 1,
  );
  const pageChangeHandler = (page: number) => {
    onChange({ currentPage: page, itemsPerPage });
  };
  const pageSizeChangeHandler = (pageSize: number) => {
    onChange({
      currentPage: Math.min(currentPage, Math.ceil(itemsCount / pageSize)),
      itemsPerPage: pageSize,
    });
  };
  return (
    <HStack>
      {itemsCount > availablePageSize[0] && (
        <Select
          w="auto"
          onChange={(e) => pageSizeChangeHandler(Number(e.target.value))}
        >
          {selectablePageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </Select>
      )}
      <Text>{`${t('of')} ${itemsCount} ${t('results')}`}</Text>
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
