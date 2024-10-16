import { useCatalog } from '@ovh-ux/manager-pci-common';
import { useMemo } from 'react';
import { TAddon } from '@/pages/create/store';

const SIZE_FLAVOUR_REGEX = /octavia-loadbalancer.loadbalancer-([sml]).hour.consumption/;

export const useGetAddons = () => {
  const { data: catalog, isPending: isCatalogPending } = useCatalog();

  return {
    data: useMemo(
      () =>
        (catalog?.addons
          ? catalog.addons.reduce((filtered: TAddon[], addon) => {
              const found = addon.planCode.match(SIZE_FLAVOUR_REGEX);
              if (found) {
                filtered.push({
                  code: found[1],
                  price: addon.pricings[0].price,
                  label: found[1].toUpperCase(),
                  technicalName: addon.blobs.technical.name,
                });
              }
              return filtered;
            }, [])
          : []
        ).sort((a, b) => a.price - b.price),
      [catalog],
    ),
    isPending: isCatalogPending,
  };
};
