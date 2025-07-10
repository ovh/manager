import JSURL from 'jsurl';
import { OrderProduct } from '@/domain/types/order';
import {
  ANYCAST_ORDER_CONSTANT,
  DEFAULT_DNS_CONFIGURATION,
} from '@/domain/constants/order';

export const formatOrderProduct = ({
  planCode,
  zoneName,
  dnssec,
  activateZone,
}: OrderProduct): Record<string, unknown> => {
  const base = {
    planCode,
    duration: ANYCAST_ORDER_CONSTANT.DURATION,
    productId: ANYCAST_ORDER_CONSTANT.PRODUCT_ID,
    quantity: ANYCAST_ORDER_CONSTANT.QUANTITY,
    pricingMode: ANYCAST_ORDER_CONSTANT.PRICING_MODE,
  };

  const configuration = activateZone
    ? [...DEFAULT_DNS_CONFIGURATION(zoneName)]
    : [];

  if (dnssec) configuration.push(ANYCAST_ORDER_CONSTANT.DNSSEC_CONFIGURATION);

  return {
    ...base,
    ...(activateZone
      ? {
          configuration,
          option: [
            {
              duration: ANYCAST_ORDER_CONSTANT.DURATION,
              planCode: ANYCAST_ORDER_CONSTANT.ANYCAST_PLAN_CODE,
              quantity: ANYCAST_ORDER_CONSTANT.QUANTITY,
              pricingMode: ANYCAST_ORDER_CONSTANT.PRICING_MODE,
            },
          ],
        }
      : {
          configuration,
          serviceName: zoneName,
        }),
  };
};

export const generateOrderUrl = ({
  baseUrl,
  products,
}: {
  baseUrl: string;
  products: OrderProduct[];
}) => {
  return `${baseUrl}?products=${JSURL.stringify(
    products.map(formatOrderProduct),
  )}`;
};
