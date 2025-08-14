import { ApiError, v6 } from '@ovh-ux/manager-core-api';
import {
  DISCOVERY_PROJECT_ACTIVATION_PAYLOAD,
  FULL_PROJECT_PLAN_CODE,
} from '@/constants';

type TPrice = {
  currencyCode: string;
  priceInUcents: number;
  text: string;
  value: number;
};

export interface ProjectActivationResponse {
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
      originalTotalPrice: TPrice;
      quantity: number;
      reductionTotalPrice: TPrice;
      reductions: {
        context: string;
        description: string;
        price: TPrice;
        reductionDescription: string;
        type: string;
        value: TPrice;
      }[];
      totalPrice: TPrice;
      unitPrice: TPrice;
    }[];
    orderId: number;
    prices: {
      originalWithoutTax: TPrice;
      reduction: TPrice;
      tax: TPrice;
      withTax: TPrice;
      withoutTax: TPrice;
    };
    url: string;
  };
}

/**
 * Simulates the activation of a discovery project
 * @param serviceId - The service ID of the project
 * @returns Promise<ProjectActivationResponse>
 */
export const simulateActivateDiscoveryProject = async (
  serviceId: number,
): Promise<ProjectActivationResponse> => {
  const { data } = await v6.post<ProjectActivationResponse>(
    `/services/${serviceId}/upgrade/${FULL_PROJECT_PLAN_CODE}/simulate`,
    DISCOVERY_PROJECT_ACTIVATION_PAYLOAD,
  );

  return data;
};

/**
 * Activates a discovery project
 * @param serviceId - The service ID of the project
 * @returns Promise<ProjectActivationResponse>
 */
export const activateDiscoveryProject = async (
  serviceId: number,
): Promise<ProjectActivationResponse> => {
  const { data } = await v6.post<ProjectActivationResponse>(
    `/services/${serviceId}/upgrade/${FULL_PROJECT_PLAN_CODE}/execute`,
    DISCOVERY_PROJECT_ACTIVATION_PAYLOAD,
  );
  return data;
};

/**
 * Claims a voucher for a project
 * @param projectId - The project ID
 * @param voucherCode - The voucher code to claim
 * @returns Promise<void>
 */
export const claimVoucher = async (
  projectId: string,
  voucherCode: string,
): Promise<void> => {
  await v6.post(`/cloud/project/${projectId}/credit`, {
    code: voucherCode,
  });
};
