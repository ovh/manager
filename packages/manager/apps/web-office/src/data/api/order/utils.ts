import JSURL from 'jsurl';

import { OfficePrepaidPlanCodes } from './type';

export type OrderProduct = {
  planCode: string;
  quantity: number;
  serviceName: string;
};

export const formatOrderProduct = ({
  planCode,
  quantity,
  serviceName,
}: OrderProduct): Record<string, unknown> => {
  return {
    planCode,
    productId: 'officePrepaid',
    quantity,
    pricingMode: 'default',
    option: [],
    configuration: [{ label: 'existing_tenant_service_name', value: serviceName }],
  };
};

export const generateOrderURL = ({
  baseURL,
  products,
}: {
  baseURL: string;
  products: OrderProduct[];
}) => {
  return `${baseURL}?products=${JSURL.stringify(products.map(formatOrderProduct))}`;
};

export const whitelistedPlanCodes = [
  OfficePrepaidPlanCodes.OFFICE_365_BUSINESS,
  OfficePrepaidPlanCodes.OFFICE_365_ENTERPRISE,
];
