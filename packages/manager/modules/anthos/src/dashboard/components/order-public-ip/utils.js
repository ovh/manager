import { ADDON_PLAN_CODE, PRICE_DURATION } from './constants';

export function extractPublicIpsAddonFromAnthosCatalog(serviceOption) {
  const addon = serviceOption.find?.(
    ({ planCode }) => planCode === ADDON_PLAN_CODE,
  );
  if (!addon) return null;
  const price = addon.prices?.find?.(
    ({ duration }) => duration === PRICE_DURATION,
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
