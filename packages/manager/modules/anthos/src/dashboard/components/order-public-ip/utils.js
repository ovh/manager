import {
  ADD_ON_PLAN_CODE,
  PRICING_INTERVAL,
  PRICING_INTERVAL_UNIT,
} from './constants';

export function extractPublicIpsAddonFromAnthosCatalog(catalog) {
  const addon = catalog.addons?.find?.(
    ({ planCode }) => planCode === ADD_ON_PLAN_CODE,
  );
  if (!addon) return null;
  const price = addon.pricings?.find?.(
    ({ interval, intervalUnit }) =>
      interval === PRICING_INTERVAL && intervalUnit === PRICING_INTERVAL_UNIT,
  );
  if (!price) return null;
  return {
    ...addon,
    price,
  };
}

export default {
  extractPublicIpsAddonFromAnthosCatalog,
};
