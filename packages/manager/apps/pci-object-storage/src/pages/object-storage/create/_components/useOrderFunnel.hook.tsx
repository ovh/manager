import { useForm } from "react-hook-form"
import { generateName } from "@/lib/nameGenerator"
import { Region, RegionTypeEnum } from "@datatr-ux/ovhcloud-types/cloud/index";
import user from '@/types/User';
import { useEffect } from "react";
import { ProductAvailability } from "@/types/Availability";
import { useAvailableRegions } from "./useAvailableRegions.component";
import order from "@/types/Order";
import { zodResolver } from "@hookform/resolvers/zod";
import storages from "@/types/Storages";
import { useOrderPricing } from "./useOrderPricing.hook";
import { ObjectContainerOffers } from "./orderFunnel.const";
import { orderFunnelFormSchema, OrderFunnelFormValues } from "./orderFunnel.schema";

interface UseOrderFunnelProps {
  regions: Region[];
  users: user.User[];
  availabilities: ProductAvailability;
  catalog: order.catalog._public.Catalog;
}
export function useOrderFunnel({
  regions,
  users,
  availabilities,
  catalog,
}: UseOrderFunnelProps) {

  const defaultValuesByOffer: Record<ObjectContainerOffers, Partial<OrderFunnelFormValues>> = {
    [ObjectContainerOffers["s3-standard"]]: {
      name: generateName(),
      offer: ObjectContainerOffers["s3-standard"],
      region: regions.find(r => r.name === "EU-WEST-PAR")?.name || "",
      replication: {
        enabled: true,
        automaticRegionSelection: true,
      },
      versioning: "disabled",
      user: users[0]?.id ?? null,
      encryption: "enabled",
    },
    [ObjectContainerOffers.swift]: {
      name: generateName(),
      offer: ObjectContainerOffers.swift,
      region: regions.find(r => r.name === "GRA")?.name || "",
      containerType: storages.TypeEnum.static,
      archive: false,
      user: users[0]?.id ?? null,
    },
  };

  const form = useForm<OrderFunnelFormValues>({
    resolver: zodResolver(orderFunnelFormSchema),
    defaultValues: defaultValuesByOffer[ObjectContainerOffers["s3-standard"]],
  });

  const offer = form.watch('offer');
  const replication = form.watch('replication');
  const region = form.watch('region');
  const currentRegion = regions.find(r => r.name === region);

  const availableRegions: Region[] = useAvailableRegions({
    regions,
    availabilities,
    options: {
      filterDisabledRegions: offer === ObjectContainerOffers["s3-standard"],
      filterServiceName: offer !== ObjectContainerOffers["s3-standard"] ? offer : null,
    }
  });

  const pricings = useOrderPricing({
    availabilities,
    offer,
    region: currentRegion,
    catalog,
    replicationEnabled: !!replication?.enabled,
  });

  // use default values on offer change
  useEffect(() => {
    form.reset(defaultValuesByOffer[offer]);
  }, [offer]);

  // force replication off
  useEffect(() => {
    if (currentRegion?.type !== RegionTypeEnum["region-3-az"]) {
      form.setValue("replication", { 
        automaticRegionSelection: false,
        enabled: false,
        region: undefined,
      }, { shouldValidate: true });
    } else {
      form.setValue("replication", { 
        automaticRegionSelection: true,
        enabled: true,
        region: undefined,
      }, { shouldValidate: true });
    }
  }, [currentRegion, form]);

  // force versioning if recplication is on
  useEffect(() => {
    if (replication?.enabled) {
      form.setValue("versioning", "enabled", { shouldValidate: true });
    }
  }, [replication, form]);

  return {
    form,
    model: {
      offer,
      currentRegion,
      replication, 
    },
    availableRegions,
    pricings,
  }
};