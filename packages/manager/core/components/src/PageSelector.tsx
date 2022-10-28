import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, HStack, IconButton, Select, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

export enum PageSelectorDisplayMode {
  ButtonMode,
  SelectMode,
}

type PageSelectorProps = {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  displayMode: PageSelectorDisplayMode;
};

export default function PageSelector({
  currentPage = 1,
  pageCount = 1,
  onPageChange = () => {},
  displayMode = PageSelectorDisplayMode.ButtonMode,
}: PageSelectorProps): JSX.Element {
  const { t } = useTranslation('pageSelector');
  const pageRange = [...Array(pageCount).keys()].map((p) => p + 1);
  return (
    <HStack>
      <IconButton
        aria-label={t('previous_page')}
        isDisabled={currentPage === 1}
        icon={<ChevronLeftIcon />}
        variant="secondary"
        onClick={() => onPageChange(currentPage - 1)}
      />
      {displayMode === PageSelectorDisplayMode.ButtonMode &&
        pageRange.map((page) => (
          <Button
            key={page}
            isDisabled={page === currentPage}
            onClick={() => onPageChange(page)}
            variant={currentPage === page ? 'primary' : 'secondary'}
            aria-label={t('goto_page_nth', { page })}
          >
            {page}
          </Button>
        ))}
      {displayMode === PageSelectorDisplayMode.SelectMode && (
        <>
          <Text>{t('page')}</Text>
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
          <Text>{t('of_n', { count: pageRange.length })}</Text>
        </>
      )}
      <IconButton
        aria-label={t('next_page')}
        isDisabled={!pageRange.length || currentPage === pageRange.length}
        icon={<ChevronRightIcon />}
        variant="secondary"
        onClick={() => onPageChange(currentPage + 1)}
      />
    </HStack>
  );
}
