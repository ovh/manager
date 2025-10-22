import { Price } from '@ovh-ux/manager-module-order';

export type IpMigrationOrder = {
  details: {
    domain: string;
    quantity: number;
    description: string;
    detailType: string;
    unitPrice: Price;
    totalPrice: Price;
  }[];
  url: string | null;
  orderId: number | null;
  prices: {
    withoutTax: Price;
    tax: Price;
    withTax: Price;
  };
  contracts: {
    url: string;
    name: string;
    content: string;
  }[];
};
