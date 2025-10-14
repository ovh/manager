import { TProject, TProjectStatus } from '@ovh-ux/manager-pci-common';
import { CurrencyCode } from '@ovh-ux/manager-react-components';
import { TService } from './service.type';

export type TProjectPrice = {
  currencyCode: CurrencyCode;
  priceInUcents?: number | null | undefined;
  text: string;
  value: number;
};

export type TAggregatedStatus = TProjectStatus | 'unpaid';

export type TProjectWithService = TProject & {
  service: TService;
  isDefault: boolean;
  isUnpaid: boolean;
  aggregatedStatus: TAggregatedStatus;
};

export type TProjects = TProjectWithService[];

export type ProjectActivationResponse = {
  order: {
    contracts: {
      content: string;
      name: string;
      url: string;
    }[];
    details: {
      cartItemID: number;
      description: string;
      detailType: string;
      domain: string;
      originalTotalPrice: TProjectPrice;
      quantity: number;
      reductionTotalPrice: TProjectPrice;
      reductions: {
        context: string;
        description: string;
        price: TProjectPrice;
        reductionDescription: string;
        type: string;
        value: TProjectPrice;
      }[];
      totalPrice: TProjectPrice;
      uniTProjectPrice: TProjectPrice;
    }[];
    orderId: number;
    prices: {
      originalWithoutTax: TProjectPrice;
      reduction: TProjectPrice;
      tax: TProjectPrice;
      withTax: TProjectPrice;
      withoutTax: TProjectPrice;
    };
    url: string;
  };
};
