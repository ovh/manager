import { get } from 'lodash-es';
import { TAX } from './migration.constants';

export const trimAddonName = (addonName) => addonName.split('rental')[0];

export const buildAddonsCommercialName = (service, property) =>
  service.addons.flatMap((addon) => {
    const splittedAddon = trimAddonName(get(addon, property, '')).split('+');
    return [...splittedAddon, ...buildAddonsCommercialName(addon, property)];
  });

export const getProposedDatacenter = (configuration) =>
  configuration.find(({ name }) => name === 'dedicated_datacenter')?.value;

export const getDatacenter = (configuration) =>
  configuration.find(({ key }) => key === 'datacenter')?.value;

export const getDiscountAsMonth = ({ promotion }) =>
  moment.duration(promotion.duration).asMonths();

export const applyTax = (price, sub) =>
  Math.round(price * (1 + (TAX[sub] || 0) / 100) * 100) / 100;

export const findPrice = (plan, mode) =>
  plan.prices.find(
    ({ capacities, pricingMode }) =>
      capacities.includes('renew') && pricingMode === mode,
  )?.price;

export const getPrice = (service) =>
  findPrice(service.proposedOffer.plan, service.proposedOffer.pricingMode)
    ?.value + service.addons.reduce((acc, addon) => acc + getPrice(addon), 0);

export const formatPrice = (service, price) =>
  findPrice(
    service.proposedOffer.plan,
    service.proposedOffer.pricingMode,
  ).text.replace(/([0-9]|\.|,)+/g, price);

export default {
  applyTax,
  buildAddonsCommercialName,
  formatPrice,
  getDatacenter,
  getPrice,
  getProposedDatacenter,
};
