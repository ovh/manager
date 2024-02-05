import { Credit, Voucher } from '@/interface';

export const defaultCompareFunction = (key: keyof Voucher) => (
  a: Voucher,
  b: Voucher,
) => {
  const aValue = a[key] || '';
  const bValue = b[key] || '';

  return (aValue as string).localeCompare(bValue as string);
};

export const creditComparator = (key: 'available_credit' | 'total_credit') => {
  return (a: Voucher, b: Voucher) => {
    const aValue = (a[key] as Credit)?.value;
    const bValue = (b[key] as Credit)?.value;

    if (aValue > bValue) {
      return 1;
    }
    return aValue < bValue ? -1 : 0;
  };
};

export const validityComparator = (key: 'from' | 'to') => (
  a: Voucher,
  b: Voucher,
) => {
  const aValue = a.validity[key] || '';
  const bValue = b.validity[key] || '';

  return (aValue as string).localeCompare(bValue as string);
};
