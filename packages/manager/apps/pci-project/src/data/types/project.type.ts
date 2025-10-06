import { TProject, TProjectStatus } from '@ovh-ux/manager-pci-common';
import { ProjectPrice } from './payment/eligibility.type';
import { TService } from './service.type';

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
      originalTotalPrice: ProjectPrice;
      quantity: number;
      reductionTotalPrice: ProjectPrice;
      reductions: {
        context: string;
        description: string;
        price: ProjectPrice;
        reductionDescription: string;
        type: string;
        value: ProjectPrice;
      }[];
      totalPrice: ProjectPrice;
      uniProjectPrice: ProjectPrice;
    }[];
    orderId: number;
    prices: {
      originalWithoutTax: ProjectPrice;
      reduction: ProjectPrice;
      tax: ProjectPrice;
      withTax: ProjectPrice;
      withoutTax: ProjectPrice;
    };
    url: string;
  };
};
