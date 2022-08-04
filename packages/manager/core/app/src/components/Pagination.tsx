import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, HStack, IconButton, Select, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

export enum PaginationDisplayMode {
  ButtonMode,
  SelectMode,
}

type PaginationProps = {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  displayMode: PaginationDisplayMode;
};

export default function Pagination({
  currentPage = 1,
  pageCount = 1,
  onPageChange = () => {},
  displayMode = PaginationDisplayMode.ButtonMode,
}: PaginationProps): JSX.Element {
  const { t } = useTranslation('common');
  const pageRange = [...Array(pageCount).keys()].map((p) => p + 1);
  return (
    <HStack>
      <IconButton
        aria-label={t('PreviousPage')}
        isDisabled={currentPage === 1}
        icon={<ChevronLeftIcon />}
        onClick={() => onPageChange(currentPage - 1)}
      />
      {displayMode === PaginationDisplayMode.ButtonMode &&
        pageRange.map((page) => (
          <Button
            key={page}
            isActive={currentPage === page}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
      {displayMode === PaginationDisplayMode.SelectMode && (
        <>
          <Text>{t('Page')}</Text>
          <Select
            w="auto"
            value={currentPage}
            onChange={(e) => onPageChange(Number(e.target.value))}
          >
            {pageRange.map((page) => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </Select>
          <Text>{`${t('of')} ${pageRange.length}`}</Text>
        </>
      )}
      <IconButton
        aria-label={t('NextPage')}
        isDisabled={!pageRange.length || currentPage === pageRange.length}
        icon={<ChevronRightIcon />}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </HStack>
  );
}
