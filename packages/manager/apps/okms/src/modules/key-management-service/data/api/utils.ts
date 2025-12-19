import { OKMS } from '@key-management-service/types/okms.type';
import { OkmsServiceKey } from '@key-management-service/types/okmsServiceKey.type';

export const defaultCompareFunction = (key: keyof OKMS) => (a: OKMS, b: OKMS) => {
  const aValue = a[key] || '';
  const bValue = b[key] || '';

  return (aValue as string).localeCompare(bValue as string);
};

export const defaultCompareFunctionSortKey =
  (key: keyof OkmsServiceKey) => (a: OkmsServiceKey, b: OkmsServiceKey) => {
    const aValue = a[key] || '';
    const bValue = b[key] || '';

    return (aValue as string).localeCompare(bValue as string);
  };
