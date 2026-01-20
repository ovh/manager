import { v6 } from '@ovh-ux/manager-core-api';
import { Subsidiary } from '@ovh-ux/manager-config';
import { FreeHostingOptions } from '@/domain/components/AssociatedServicesCards/Hosting';
import { formatConfigurationValue } from '@/domain/utils/utils';
import { TInitialOrderFreeHosting } from '@/domain/types/hosting';
import { TServiceInfo } from '@/common/types/common.types';
import { FREE_HOSTING_PLAN_CODE } from '@/domain/constants/order';

export const getAssociatedHosting = async (
  serviceName: string,
): Promise<string[]> => {
  const { data } = await v6.get(
    `hosting/web/attachedDomain?domain=${serviceName}`,
  );
  return data;
};

export const initialOrderFreeHosting = async (
  serviceName: string,
  subsidiary: Subsidiary,
  pricingMode: string,
): Promise<TInitialOrderFreeHosting> => {
  const { data: orderCart } = await v6.post(`order/cart`, {
    ovhSubsidiary: subsidiary,
  });

  await v6.post(`order/cart/${orderCart?.cartId}/assign`, {
    cartId: orderCart?.cartId,
  });

  await v6.post(`order/cartServiceOption/domain/${serviceName}`, {
    cartId: orderCart?.cartId,
    duration: 'P1Y',
    planCode: FREE_HOSTING_PLAN_CODE,
    pricingMode: pricingMode,
    quantity: 1,
  });

  const { data: checkout } = await v6.get(
    `order/cart/${orderCart?.cartId}/checkout`,
  );

  const result = { cartId: orderCart?.cartId, ...checkout };

  return result;
};

export const orderFreeHosting = async (
  cartId: string,
  itemId: number,
  options: FreeHostingOptions,
): Promise<void> => {
  await v6.post(`order/cart/${cartId}/item/${itemId}/configuration`, {
    label: 'dns_zone',
    value: formatConfigurationValue(options),
  });

  const { data: checkout } = await v6.post(`order/cart/${cartId}/checkout`, {
    autoPayWithPreferredPaymentMethod: false,
    waiveRetractationPeriod: true,
  });

  if (checkout.prices.withTax.value === 0) {
    await v6.post(`me/order/${checkout.orderId}/payWithRegisteredPaymentMean`, {
      paymentMean: 'fidelityAccount',
    });
  }

  return checkout;
};

export const getFreeHostingService = async (
  serviceName: string,
): Promise<TServiceInfo> => {
  const { data: serviceId } = await v6.get(
    `services/?routes=/hosting/web&resourceName=${serviceName}`,
  );

  const { data: serviceDetails } = await v6.get(`services/${serviceId}`);
  return serviceDetails;
};

export const getAssociatedSubDomainsMultiSite = async (
  hostingName: string,
): Promise<string[]> => {
  const { data } = await v6.get(`hosting/web/${hostingName}/attachedDomain`);
  return data;
};
