import isObject from 'lodash/isObject';
import { MONTHLY_STRATEGY, PRODUCT_MAPPING } from './billing.constants';

export const formatPrice = (price, value) =>
  price.text.replace(/([0-9]|\.|,)+/g, value);

export const getPrice = (catalogItem, price) => {
  const value =
    catalogItem.pricings.find(({ capacities }) =>
      capacities.includes('consumption'),
    )?.price / 100000000;
  const catalogPrice = catalogItem.blobs?.commercial?.price;
  const commercialUnit = catalogPrice?.unit || catalogPrice?.interval;
  const unit =
    catalogItem.consumptionConfiguration?.billingStrategy === MONTHLY_STRATEGY
      ? 'month'
      : 'hour';
  return {
    value: formatPrice(price, value),
    unit: commercialUnit ? commercialUnit.replace('*', '_') : unit,
  };
};

export const formatBillingDetails = (details, planFamily, catalog, price) =>
  details[planFamily].map((detail) => {
    const serviceId = detail.metadata?.find(
      ({ key }) => key.includes('_id') || key.includes('_uuid'),
    )?.value;
    const region = detail.metadata?.find(({ key }) => key.includes('region'))
      ?.value;
    return {
      ...detail,
      serviceId,
      region,
      id: serviceId || region || detail.uniqueId,
      flavor: detail.metadata?.find(({ key }) => key.includes('flavor_name'))
        ?.value,
      catalogPrice: getPrice(
        catalog.addons.find(({ planCode }) => planCode === detail.planCode),
        price,
      ),
    };
  });

export const getURL = (planFamily, planCode) =>
  isObject(PRODUCT_MAPPING[planFamily])
    ? PRODUCT_MAPPING[planFamily][planCode]
    : PRODUCT_MAPPING[planFamily];

export default {
  formatBillingDetails,
  getPrice,
  formatPrice,
  getURL,
};
