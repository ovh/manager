import JSURL from 'jsurl';
import { ZimbraPlanCodes } from './type';

export type OrderProduct = {
  planCode: string;
  quantity: number;
  platformId: string;
};

export const formatOrderProduct = ({
  planCode,
  quantity,
  platformId,
}: OrderProduct): Record<string, unknown> => {
  return {
    planCode,
    productId: 'zimbra',
    quantity,
    pricingMode: 'default',
    option: [],
    configuration: [{ label: 'existing_platform_id', value: platformId }],
  };
};

export const generateOrderURL = ({
  baseURL,
  products,
}: {
  baseURL: string;
  products: OrderProduct[];
}) => {
  return `${baseURL}?products=${JSURL.stringify(
    products.map(formatOrderProduct),
  )}`;
};

export const whitelistedPlanCodes = [ZimbraPlanCodes.ZIMBRA_ACCOUNT_PP_STARTER];
