import {
  ADDON_PRODUCT_NAME,
  MAX_ADDONS,
  PRICING_INTERVAL,
  PRICING_INTERVAL_UNIT,
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

export function extractHostAddonsFromAnthosCatalog(catalog) {
  return catalog.addons
    .filter(({ product }) => product === ADDON_PRODUCT_NAME)
    .map((addon) =>
      formatAddon({
        ...addon,
        pricings: addon.pricings.filter(
          ({ interval, intervalUnit }) =>
            interval === PRICING_INTERVAL &&
            intervalUnit === PRICING_INTERVAL_UNIT,
        ),
      }),
    );
}

export default {
  extractHostAddonsFromAnthosCatalog,
};
