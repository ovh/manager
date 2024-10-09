import { Period } from '@/types/bills.type';

export const usePeriodFilter = ({ from, to }: Period) => [
  {
    field: 'date',
    comparator: 'isAfter',
    reference: [from],
  },
  {
    field: 'date',
    comparator: 'isBefore',
    reference: [to],
  },
];
