import { OKMS } from '@/types/okms.type';

export const defaultCompareFunction = (key: keyof OKMS) => (
  a: OKMS,
  b: OKMS,
) => {
  const aValue = a[key] || '';
  const bValue = b[key] || '';

  return (aValue as string).localeCompare(bValue as string);
};
