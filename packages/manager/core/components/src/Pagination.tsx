import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HStack, Select, Text } from '@chakra-ui/react';

import PageSelector, { PageSelectorDisplayMode } from './PageSelector';

export type PaginationProps = {
  currentPage: number;
  pageSize: number;
  itemsCount: number;
  availablePageSize?: number[];
  onChange: (currentPage: number, pageSize: number) => void;
};

export default function Pagination({
  currentPage,
  pageSize,
  itemsCount,
  availablePageSize = [10, 25, 50, 100, 300],
  onChange,
}: PaginationProps): JSX.Element {
  const { t } = useTranslation('pagination');
  const pageCount = Math.ceil(itemsCount / pageSize);

  const pageChangeHandler = (page: number) => {
    onChange(
      Math.min(page, itemsCount ? Math.ceil(itemsCount / pageSize) : 1),
      pageSize,
    );
  };

  const pageSizeChangeHandler = (size: number) => {
    onChange(
      Math.min(currentPage, itemsCount ? Math.ceil(itemsCount / size) : 1),
      size,
    );
  };

  useEffect(() => {
    if (itemsCount === 0 && currentPage > 1) {
      pageChangeHandler(1);
    }
  }, []);

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
      <PageSelector
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={pageChangeHandler}
        displayMode={
          pageCount > 5
            ? PageSelectorDisplayMode.SelectMode
            : PageSelectorDisplayMode.ButtonMode
        }
      />
    </HStack>
  );
}
