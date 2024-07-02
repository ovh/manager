import { TCredit, TVoucher } from '@/interface';

export const defaultCompareFunction = (key: keyof TVoucher) => (
  a: TVoucher,
  b: TVoucher,
) => {
  const aValue = a[key] || '';
  const bValue = b[key] || '';

  return (aValue as string).localeCompare(bValue as string);
};

export const creditComparator = (key: 'available_credit' | 'total_credit') => (
  a: TVoucher,
  b: TVoucher,
) => {
  const aValue = (a[key] as TCredit)?.value;
  const bValue = (b[key] as TCredit)?.value;

  if (aValue > bValue) {
    return 1;
  }
  return aValue < bValue ? -1 : 0;
};

export const validityComparator = (key: 'from' | 'to') => (
  a: TVoucher,
  b: TVoucher,
) => {
  const aValue = a.validity[key] || '';
  const bValue = b.validity[key] || '';

  return (aValue as string).localeCompare(bValue as string);
};
