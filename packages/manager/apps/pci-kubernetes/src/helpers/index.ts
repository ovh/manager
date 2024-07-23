import { PaginationState } from '@ovhcloud/manager-components';

export const paginateResults = <T>(
  items: T[],
  pagination: PaginationState,
) => ({
  rows: items.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize,
  ),
  pageCount: Math.ceil(items.length / pagination.pageSize),
  totalRows: items.length,
});

export const downloadContent = ({
  fileContent,
  fileName,
}: {
  fileContent: string;
  fileName: string;
}) => {
  const charSet = navigator.platform.toUpperCase().includes('WIN')
    ? 'charset=windows-1252;base64'
    : 'charset=utf-8;base64';
  const blob = new Blob([fileContent], { type: `text/plain;${charSet}` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Cleanup
  URL.revokeObjectURL(url);
};
