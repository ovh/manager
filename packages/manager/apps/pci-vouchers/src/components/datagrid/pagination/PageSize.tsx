import { OsdsSelect, OsdsSelectOption } from '@ovhcloud/ods-components/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type PageSizeProps = {
  pageSizes: number[];
  currentPageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  numItems: number;
};
export default function PageSize({
  pageSizes,
  currentPageSize,
  onPageSizeChange,

  numItems,
}: PageSizeProps) {
  const { t } = useTranslation('common');

  if (numItems < 10) {
    return (
      <span style={{ marginLeft: '0.5rem' }}>
        {t('common_pagination_nresults', { TOTAL_ITEMS: numItems })}
      </span>
    );
  }

  const pageSizeStrategy = useMemo(() => {
    if (numItems > 300) {
      return {
        pageSizes: [...pageSizes],
        currentPageSize,
      };
    }

    const idx = pageSizes.findIndex((size) => size > numItems);
    if (idx < 0) {
      return {
        pageSizes: [...pageSizes],
        currentPageSize,
      };
    }

    let newPageSizes = pageSizes.slice(0, idx + 1);
    if (pageSizes.includes(numItems)) {
      newPageSizes = pageSizes.slice(0, idx + 2);
    }

    return {
      pageSizes: newPageSizes,
      currentPageSize: newPageSizes.includes(currentPageSize)
        ? currentPageSize
        : newPageSizes[newPageSizes.length - 1],
    };
  }, [pageSizes, currentPageSize, numItems]);

  return (
    <>
      <OsdsSelect
        defaultValue={pageSizeStrategy.currentPageSize}
        onOdsValueChange={({ detail }) =>
          onPageSizeChange(
            parseInt(
              (detail.value || pageSizeStrategy.pageSizes[0]).toString(),
              10,
            ),
          )
        }
        inline
        data-testid="select"
      >
        {pageSizeStrategy.pageSizes.map((pageSize, pageSizeIndex) => (
          <OsdsSelectOption key={pageSize} value={pageSize}>
            {pageSizeIndex === pageSizeStrategy.pageSizes.length - 1
              ? numItems
              : pageSize}
          </OsdsSelectOption>
        ))}
      </OsdsSelect>
      <span className="ml-1">
        {t('common_pagination_ofnresults', { TOTAL_ITEMS: numItems })}
      </span>
    </>
  );
}
