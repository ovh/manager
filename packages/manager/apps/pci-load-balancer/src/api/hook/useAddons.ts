import { TAddon, useCatalog } from '@ovh-ux/manager-pci-common';
import { useMemo } from 'react';

const SIZE_FLAVOUR_REGEX = /octavia-loadbalancer.loadbalancer-([23]?xl|[sml]).hour.consumption$/;

const getSize = (addon: TAddon) => addon.product.split('-').pop();

const getSortedAddons = (addons: TAddon[]) => {
  const sizeOrder = ['s', 'm', 'l', 'xl', '2xl'];

  return addons
    .filter(({ planCode }) => planCode.match(SIZE_FLAVOUR_REGEX))
    .sort((a, b) => {
      const sizeA = getSize(a);
      const sizeB = getSize(b);

      return sizeOrder.indexOf(sizeA) - sizeOrder.indexOf(sizeB);
    });
};

export const useGetAddons = () => {
  const { data: catalog, isPending: isCatalogPending } = useCatalog();

  return {
    data: useMemo(() => {
      const addons = catalog?.addons ? getSortedAddons(catalog.addons) : [];

      return addons.map((addon) => {
        const code = getSize(addon);

        return {
          code,
          price: addon.pricings[0].price,
          label: code.toUpperCase(),
          technicalName: addon.blobs.technical.name,
        };
      });
    }, [catalog]),
    isPending: isCatalogPending,
  };
};
