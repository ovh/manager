import { useMemo } from 'react';
import { ProductAvailability } from '@/types/Availability';
import { ObjectContainerOffers } from './orderFunnel.const';
import order from '@/types/Order';
import cloud from '@/types/Cloud';

interface UseOrderPricingProps {
  availabilities: ProductAvailability;
  offer: ObjectContainerOffers;
  region: cloud.Region;
  catalog: order.catalog._public.Catalog;
  replicationEnabled: boolean;
}
export function useOrderPricing({
  availabilities,
  offer,
  region,
  catalog,
  replicationEnabled,
}: UseOrderPricingProps) {
  const pricings = useMemo(() => {
    const REGION_TYPE_PREFIX: Record<string, string> = {
      [cloud.RegionTypeEnum.localzone]: '-LZ',
      [cloud.RegionTypeEnum['region-3-az']]: '-3AZ',
    };
    if (offer === ObjectContainerOffers['s3-standard']) {
      const regionPrefix = REGION_TYPE_PREFIX[region.type] || '';
      const offerPlanCode = `storage-standard${regionPrefix}.consumption`;
      const replicationOptionPlanCode = `storage-standard-ia.consumption`;
      return {
        offer: catalog?.addons.find(
          (addon) => addon.planCode === offerPlanCode,
        ),
        replication: replicationEnabled
          ? catalog?.addons.find(
              (addon) => addon.planCode === replicationOptionPlanCode,
            )
          : null,
      };
    }

    return {
      offer: catalog?.addons.find(
        (addon) => addon.planCode === 'storage.consumption',
      ),
      replication: null,
    };
  }, [availabilities, catalog, offer, region, replicationEnabled]);

  return pricings;
}
