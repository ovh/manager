import ArrowButton from './ArrowButton';
import Ellipsis from './Ellipsis';
import PageButton from './PageButton';
import PageSize from './PageSize';

export type PaginationProps = {
  numPages: number;
  currentPage: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onPageChange: (page: number) => void;

  numItems: number;

  currentPageSize: number;
  pageSizes: number[];
  onPageSizeChange: (pageSize: number) => void;
};

export const getPageGroups = (
  numPages: number,
  currentPage: number,
): number[][] => {
  let pageGroups: number[][] = [];
  const lastPage = numPages - 1;

  if (numPages > 1) {
    if (numPages <= 6) {
      pageGroups = [[0, 1, 2, 3, 4, 5].slice(0, numPages)];
    } else if (currentPage <= 3) {
      pageGroups = [[0, 1, 2, 3, 4], [lastPage]];
    } else if (currentPage >= lastPage - 2) {
      pageGroups = [
        [0],
        [lastPage - 4, lastPage - 3, lastPage - 2, lastPage - 1, lastPage],
      ];
    } else {
      pageGroups = [
        [0],
        [currentPage - 1, currentPage, currentPage + 1],
        [lastPage],
      ];
    }
  }

  return pageGroups;
};

export default function Pagination({
  numPages,
  currentPage,
  canPreviousPage,
  canNextPage,
  onPageChange,

  numItems,

  currentPageSize,
  pageSizes,
  onPageSizeChange,
}: PaginationProps) {
  const pageGroups = getPageGroups(numPages, currentPage);

  return (
    <>
      <PageSize
        pageSizes={pageSizes}
        currentPageSize={currentPageSize}
        onPageSizeChange={onPageSizeChange}
        numItems={numItems}
      />

      {pageGroups && pageGroups.length > 0 && (
        <>
          <ArrowButton
            direction="left"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canPreviousPage}
          />

          {pageGroups &&
            pageGroups.map((group, index) => (
              <span key={`page-${index}`}>
                {index > 0 && <Ellipsis />}
                {group.map((pageIndex) => (
                  <PageButton
                    key={pageIndex}
                    isCurrent={pageIndex === currentPage}
                    onClick={() => onPageChange(pageIndex)}
                  >
                    {pageIndex + 1}
                  </PageButton>
                ))}
              </span>
            ))}
          <ArrowButton
            direction="right"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canNextPage}
          />
        </>
      )}
    </>
  );
}
