import { PaginationState } from '@ovh-ux/manager-react-components';
import { z } from 'zod';

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

/**
 * Validates data against a given Zod schema.
 *
 * @template T - Type of the data to validate.
 * @param params - Parameters for the function.
 * @param params.schema - The Zod schema used for validation.
 * @param params.data - The data to validate.
 * @param params.onInvalid - Optional function called in case of validation error.
 * @returns - The validated data or null if validation fails.
 */
export function validateSchema<T>({
  schema,
  data,
  onInvalid,
}: {
  schema: z.Schema;
  data: T;
  onInvalid?: (error: z.ZodError) => void;
}) {
  try {
    const validatedData = schema.parse(data);
    return validatedData as T;
  } catch (error) {
    if (onInvalid && error instanceof z.ZodError) {
      onInvalid(error);
    }
  }
  return null;
}

/**
 * Converts a number of bytes into a human-readable format (e.g., Ko, Mo, Go, To).
 *
 * @param bytes - The number of bytes to convert.
 * @returns - The formatted string representing the size in appropriate units.
 */
export function formatBytes(bytes: number): string {
  const units = ['o', 'KiB', 'MiB', 'GiB', 'TiB'];
  const convertionRate = 1024;
  let unitIndex = 0;
  let size = bytes; // Use a separate variable to hold the size value

  while (size >= convertionRate && unitIndex < units.length - 1) {
    size /= convertionRate;
    unitIndex += 1;
  }

  return `${Math.round(size)} ${units[unitIndex]}`;
}

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
      threshold: 69,
      color: 'var(--ods-color-primary-500)',
    }, // Color for less than or equal to 33.333%
    {
      threshold: 79,
      color: 'var(--ods-color-warning-500)',
    }, // Color for between 33.333% and 66%
    { threshold: 100, color: 'var(--ods-color-error-500)' }, // Color for greater than 80%
  ].sort((a, b) => a.threshold - b.threshold);
  // Sort thresholds to ensure they are in ascending order
  colorThresholds.sort((a, b) => a.threshold - b.threshold);

  // Loop through thresholds to find the appropriate color
  for (let i = 0; i < colorThresholds.length; i += 1) {
    const { threshold, color } = colorThresholds[i];
    if (percentage <= threshold) {
      return color;
    }
  }

  // If percentage exceeds all thresholds, return the last color
  return colorThresholds[colorThresholds.length - 1].color;
}
