import { AxiosError } from 'axios';
import { v6 } from '@ovh-ux/manager-core-api';

import {
  Cart,
  PlanCode,
  CartProduct,
  OrderedProduct,
  CartSummary,
  PaymentMean,
} from '@/data/types/cart.type';

const orderCloudProject = async (
  cartId: string,
  planCode: PlanCode,
): Promise<OrderedProduct> => {
  // Fetch list of product offers, throw if the cloud product offer is missing.
  const { data: productOffers } = await v6.get<CartProduct[]>(
    `order/cart/${cartId}/cloud`,
  );
  const cloudProjectOffer = productOffers.find((d) => d.planCode === planCode);
  if (!cloudProjectOffer) {
    throw new AxiosError(`planCode ${planCode} not found`);
  }

  // Find the correct offer & pricing (matching planCode & capacities = 'renew')
  const renewPrice = cloudProjectOffer.prices.find((price) =>
    price.capacities.includes('renew'),
  );
  if (!renewPrice) {
    throw new AxiosError(`could not find 'renew' price in product offer.`);
  }
  const { duration, pricingMode } = renewPrice;

  // Now that we have the right order information, order the product
  const { data: orderedProduct } = await v6.post<OrderedProduct>(
    `order/cart/${cartId}/cloud`,
    {
      duration,
      planCode,
      pricingMode,
      quantity: 1,
    },
  );

  return orderedProduct;
};

export const createCart = async (
  ovhSubsidiary: string,
  planCode: PlanCode,
  projectDescription: string,
): Promise<Cart> => {
  const { data: cart } = await v6.post<Cart>('order/cart', { ovhSubsidiary });
  const { cartId } = cart;

  // Attach cartId on cart (NOTE: Note sure why or if it's still needed)
  await v6.post(`order/cart/${cartId}/assign`, { cartId });

  // NOTE: I'm not sure this API call is useful either
  await v6.get(`order/cart/${cartId}/cloud/options?planCode=${planCode}`);

  // Order in the cart the cloud product (with matching planCode & capacities)
  const orderedCloudProduct = await orderCloudProject(cartId, planCode);

  // Attach project description to cart
  await v6.post(
    `order/cart/${cartId}/item/${orderedCloudProduct.itemId}/configuration`,
    {
      label: 'description',
      value: projectDescription,
    },
  );

  return cart;
};

export const getSummary = async (cartId: string): Promise<CartSummary> => {
  const { data } = await v6.get<CartSummary>(`order/cart/${cartId}/summary`);
  return data;
};

export const checkoutCart = async (cartId: string): Promise<CartSummary> => {
  const { data: summary } = await v6.post<CartSummary>(
    `order/cart/${cartId}/checkout`,
  );
  if (summary.prices.withTax.value === 0) {
    await v6.post(`me/order/${summary.orderId}/payWithRegisteredPaymentMean`, {
      paymentMean: PaymentMean.FIDELITY_ACCOUNT,
    });
  }
  return summary;
};
