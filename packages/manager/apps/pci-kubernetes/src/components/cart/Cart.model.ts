import { ReactNode } from 'react';

export type TCartItem = {
  id: string;
  title: string;
  name?: string;
  details: TCartItemDetail[];
  expanded: boolean;
};

export type TCartItemDetail = {
  id: string;
  name: string;
  description?: ReactNode;
  price: number | null;
  priceUnit?: string;
  isApproximate?: boolean;
};
