import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import get from 'lodash.get';
import { IPTypeEnum, TIpType } from '@/api/types';
import { useCloudCatalog } from '@/api/hooks/catalog/useCloudCatalog';
import { useIpCatalog } from '@/api/hooks/catalog/useIpCatalog';

export const useIpTypes = () => {
  const { t: tOrder } = useTranslation('order');
  const [ipTypes, setIpTypes] = useState<TIpType[]>([]);

  const {
    data: publicCloudCatalog,
    isPending: isPublicCloudCatalogPending,
  } = useCloudCatalog();
  const {
    data: formattedIpCatalog,
    isPending: isFormattedIpCatalogPending,
  } = useIpCatalog();

  useEffect(() => {
    if (!isFormattedIpCatalogPending && !isPublicCloudCatalogPending) {
      const {
        pricings: [{ price: floatingIpPrice = '0' }],
      } = (publicCloudCatalog?.addons || []).find(
        (addon: { product: string }) =>
          addon.product === 'publiccloud-floatingip-floatingip',
      );

      const failoverIpPrice = `${get(
        formattedIpCatalog,
        'plans[0].details.pricings.default[0].price.text',
      )}`;

      setIpTypes(() =>
        Object.keys(IPTypeEnum).map((key) => ({
          name: IPTypeEnum[key] as string,
          label: tOrder(`pci_additional_ip_${IPTypeEnum[key]}`),
          description: tOrder(
            `pci_additional_ip_${IPTypeEnum[key]}_description`,
          ),
          price:
            IPTypeEnum[key] === IPTypeEnum.FLOATING
              ? floatingIpPrice
              : failoverIpPrice,
        })),
      );
    }
  }, [isPublicCloudCatalogPending, isFormattedIpCatalogPending]);

  return {
    isPending: isFormattedIpCatalogPending || isPublicCloudCatalogPending,
    ipTypes,
  };
};
