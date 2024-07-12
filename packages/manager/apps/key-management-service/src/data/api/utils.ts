import { OKMS } from '@/types/okms.type';
import { OkmsAllServiceKeys } from '@/types/okmsServiceKey.type';

export const defaultCompareFunction = (key: keyof OKMS) => (
  a: OKMS,
  b: OKMS,
) => {
  const aValue = a[key] || '';
  const bValue = b[key] || '';

  return (aValue as string).localeCompare(bValue as string);
};

export const defaultCompareFunctionSortKey = (
  key: keyof OkmsAllServiceKeys,
) => (a: OkmsAllServiceKeys, b: OkmsAllServiceKeys) => {
  const aValue = a[key] || '';
  const bValue = b[key] || '';

  return (aValue as string).localeCompare(bValue as string);
};
