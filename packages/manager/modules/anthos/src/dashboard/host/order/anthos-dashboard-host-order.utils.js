import {
  ADDON_PRODUCT_FAMILY,
  MAX_ADDONS,
  PRICE_DURATION,
} from './anthos-dashboard-host-order.constants';

export function formatAddon(addon) {
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
    $max: MAX_ADDONS,
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
    .filter(({ family }) => family === ADDON_PRODUCT_FAMILY)
    .map((addon) =>
      formatAddon({
        ...catalog.addons?.find?.(
          ({ planCode }) => planCode === addon.planCode,
        ),
        pricings: addon.prices.filter(
          ({ duration }) => duration === PRICE_DURATION,
        ),
      }),
    );
}

export default {
  extractHostAddonsFromAnthosServiceOption,
};
