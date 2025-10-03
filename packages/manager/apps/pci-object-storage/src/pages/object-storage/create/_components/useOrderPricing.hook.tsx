import { ProductAvailability } from "@/types/Availability";
import { useMemo } from "react";
import { ObjectContainerOffers, PLAN_CODES } from "./orderFunnel.const";
import order from "@/types/Order";
import cloud from "@/types/Cloud";

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
    const plans = availabilities?.plans?.filter((plan) =>
        plan.code?.startsWith(PLAN_CODES[offer]),
      )
    const eligibleAddons = plans
      .filter((plan) =>
        plan.regions.some(
          (r) => r.name === region.name,
        ),
      )
      .map(({ code }) =>
        catalog?.addons.find((addon) => addon.planCode === code),
      )
      // .filter(
      //   (addon) => addon?.invoiceName === PLAN_CODES[offer],
      // )
      // .map((addon) => addon?.pricings?.[0]?.price * HOUR_IN_MONTH * MEGA_BYTES / 100_000_000 || 0);

      /*
      storage-standard-3AZ.consumption
      storage-standard-ia-3AZ.consumption

      storage-standard.consumption
      storage-standard-ia.consumption

      storage.consumption

      */
      console.log(eligibleAddons)
      // console.log(replication)

      if (offer === ObjectContainerOffers["s3-standard"]) {
        const REGION_TYPE_PREFIX: Record<string, string> = {
          [cloud.RegionTypeEnum.localzone]: '-LZ',
          [cloud.RegionTypeEnum["region-3-az"]]: '-3AZ',
        };
        const regionPrefix = REGION_TYPE_PREFIX[region.type] || ''
        const offerPlanCode = `storage-standard${regionPrefix}.consumption`;
        const replicationOptionPlanCode = `storage-standard-ia.consumption`;
        return  {
          offer: catalog?.addons.find((addon) => addon.planCode === offerPlanCode),
          replication: replicationEnabled ? catalog?.addons.find((addon) => addon.planCode === replicationOptionPlanCode) : null
        }
      } 
      
      return {
        offer: catalog?.addons.find((addon) => addon.planCode === 'storage.consumption'),
        replication: null
      }
  }, [availabilities, catalog, offer, region, replicationEnabled]);

  return pricings;
}