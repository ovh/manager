import { PaginationState } from '@ovh-ux/manager-react-components';

export const REFETCH_INTERVAL_DURATION = 15_000;
export const QUOTA_ERROR_URL =
  'https://docs.ovh.com/gb/en/kubernetes/etcd-quota-error/';

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

type ColorThreshold = {
  threshold: number; // The upper limit for the threshold
  color: string; // The color associated with this threshold
};
/**
 * Returns the appropriate color based on the provided percentage.
 *
 * @param percentage - The percentage value (0 to 100).
 * @returns - The color corresponding to the percentage.
 */
export function getColorByPercentage(percentage: number): string {
  const colorThresholds: ColorThreshold[] = [
    {
      threshold: 70,
      color: 'var(--ods-color-primary-500)',
    }, // Color for less than or equal to 33.333%
    {
      threshold: 80,
      color: 'var(--ods-color-warning-500)',
    }, // Color for between 33.333% and 66%
    { threshold: 100, color: 'var(--ods-color-error-500)' }, // Color for greater than 80%
  ].sort((a, b) => a.threshold - b.threshold);
  // Sort thresholds to ensure they are in ascending order
  colorThresholds.sort((a, b) => a.threshold - b.threshold);
  // Loop through thresholds to find the appropriate color
  for (let i = 0; i < colorThresholds.length; i += 1) {
    const { threshold, color } = colorThresholds[i];
    if (percentage === 100) {
      return 'var(--ods-color-error-500)';
    }
    if (percentage < threshold) {
      return color;
    }
  }
  // If percentage exceeds all thresholds, return the last color
  return colorThresholds[colorThresholds.length - 1].color;
}
