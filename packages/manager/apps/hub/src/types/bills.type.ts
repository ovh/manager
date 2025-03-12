import { ApiEnvelope } from '@/types/apiEnvelope.type';

type Currency = {
  code: string;
  format: string;
  symbol: string;
};

export type Period = {
  from: string;
  to: string;
};

export type Bills = {
  currency: Currency;
  period: Period;
  total: number;
};

type BillsContainer = {
  bills: ApiEnvelope<Bills>;
};

export type BillsCapsule = ApiEnvelope<BillsContainer>;
