import { PaginationState } from '@ovh-ux/manager-react-components';

export const REFETCH_INTERVAL_DURATION = 15000;

export const compareFunction = <T>(key: keyof T) => (a: T, b: T) => {
  const aValue = a[key] || '';
  const bValue = b[key] || '';

  return aValue.toString().localeCompare(bValue.toString());
};

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

export const getFormatedKubeVersion = (version: string) =>
  version.substring(0, version.lastIndexOf('.'));

export const formatIP = (ip: string) => {
  const [cidr, mask] = ip.split('/');
  return `${cidr}/${parseInt(mask, 10) || 32}`;
};

export const isIPValid = (ip: string) => {
  try {
    const [cidr, mask] = ip.split('/');
    const splittedCidr = cidr.split('.');

    if (splittedCidr.length !== 4) {
      return false;
    }

    if (mask || mask === '') {
      splittedCidr.push(mask);
    }

    return splittedCidr.every(
      (value) => parseInt(value, 10) >= 0 && parseInt(value, 10) < 256,
    );
  } catch (error) {
    return false;
  }
};
