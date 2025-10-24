import { BASE_1024 } from './constants';

export const getFileSystemMountPath = (accessPath) =>
  `sudo mount -t nfs -o rw,hard,rsize=65536,wsize=65536,vers=3,tcp ${accessPath} /media/nfs01`;

export const saveMountPath = (accessPath) =>
  `${accessPath} /media/nfs01 nfs defaults user _netdev bg`;

export default {
  getFileSystemMountPath,
  saveMountPath,
};

const units = ['Ko', 'Mo', 'Go', 'To'];
/**
 * Format a value to the best unit.
 * If you have octets to format, omit the index.
 * If you have Ko to format, set index = 1.
 *
 * @param {number} value value to format in Ko, Mo, Go or To
 * @param {number} index the right unit. Default 0
 * @returns
 */
export const formatValueToBestUnit = (value, index = 0) => {
  const val = value / BASE_1024;

  if (val >= BASE_1024) return formatValueToBestUnit(val, index + 1);

  return `${Math.round(val)} ${units[index]}`;
};
