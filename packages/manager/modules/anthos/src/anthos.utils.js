import {
  ADDON_HOST_PRODUCT_FAMILY,
  ADDON_PUBLIC_IP_PLAN_CODE,
  MAX_HOST_ADDON,
  PRICE_DURATION,
} from './anthos.constants';

export function formatHostAddon(addon) {
  const {
    blobs: {
      commercial: { name: host },
      technical: {
        cpu,
        memory,
        network,
        storage: { disks },
      },
    },
    planCode: id,
    pricings: [{ price }],
  } = addon;

  const disksSet = disks.reduce(
    (set, { capacity, interface: inf, sizeUnit }) => {
      const description = `${capacity}${sizeUnit} ${inf}`;
      return {
        ...set,
        [description]: (set[description] || 0) + 1,
      };
    },
    {},
  );
  const storages = Object.entries(disksSet).map(
    ([description, quantity]) => `${quantity} x ${description}`,
  );

  const networksSet = network.reduce(
    (set, { capacity }) => ({
      ...set,
      [capacity]: (set[capacity] || 0) + 1,
    }),
    {},
  );
  const networks = Object.entries(networksSet).map(
    ([description, quantity]) => `${quantity} x ${description}`,
  );

  return {
    $max: MAX_HOST_ADDON,
    $raw: addon,
    id,
    quantity: 0,
    host,
    cpu,
    memory,
    storages,
    networks,
    price,
  };
}

export function extractHostAddonsFromAnthosServiceOption(
  serviceOption,
  catalog,
) {
  return serviceOption
    .filter(({ family }) => family === ADDON_HOST_PRODUCT_FAMILY)
    .map((addon) =>
      formatHostAddon({
        ...catalog.addons?.find(({ planCode }) => planCode === addon.planCode),
        pricings: addon.prices.filter(
          ({ duration }) => duration === PRICE_DURATION,
        ),
      }),
    );
}

export function extractPublicIpsAddonFromAnthosServiceOption(serviceOption) {
  const addon = serviceOption.find(
    ({ planCode }) => planCode === ADDON_PUBLIC_IP_PLAN_CODE,
  );
  if (!addon) return null;
  const price = addon.prices?.find(
    ({ duration }) => duration === PRICE_DURATION,
  );
  if (!price) return null;
  return {
    ...addon,
    price,
  };
}

export default {
  extractHostAddonsFromAnthosServiceOption,
  extractPublicIpsAddonFromAnthosServiceOption,
};
