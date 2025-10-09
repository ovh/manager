import { useForm } from 'react-hook-form';
import { Region, RegionTypeEnum } from '@datatr-ux/ovhcloud-types/cloud/index';
import { useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { generateName } from '@/lib/nameGenerator';
import * as Tuser from '@/types/User';
import { ProductAvailability } from '@/types/Availability';
import { useAvailableRegions } from './useAvailableRegions.component';
import order from '@/types/Order';
import storages from '@/types/Storages';
import { useOrderPricing } from './useOrderPricing.hook';
import { ObjectContainerOffers } from './orderFunnel.const';
import cloud from '@/types/Cloud';
import {
  createOrderFunnelFormSchema,
  OrderFunnelFormValues,
} from './orderFunnel.schema';

interface UseOrderFunnelProps {
  regions: Region[];
  users: Tuser.default.User[];
  availabilities: ProductAvailability;
  catalog: order.catalog._public.Catalog;
}

export const isS3Order = (
  o: cloud.StorageContainerCreation | cloud.ProjectStorageCreation,
): o is cloud.StorageContainerCreation => 'name' in o;

export const isSwiftOrder = (
  o: cloud.StorageContainerCreation | cloud.ProjectStorageCreation,
): o is cloud.ProjectStorageCreation => 'containerName' in o;

export function useOrderFunnel({
  regions,
  users,
  availabilities,
  catalog,
}: UseOrderFunnelProps) {
  const { t } = useTranslation('pci-object-storage/order-funnel');
  const orderFunnelFormSchema = createOrderFunnelFormSchema(t);

  const defaultValuesByOffer: Record<
    ObjectContainerOffers,
    Partial<OrderFunnelFormValues>
  > = {
    [ObjectContainerOffers['s3-standard']]: {
      name: generateName(),
      offer: ObjectContainerOffers['s3-standard'],
      region: regions.find((r) => r.name === 'EU-WEST-PAR')?.name || '',
      replication: {
        enabled: true,
        automaticRegionSelection: true,
      },
      versioning: storages.VersioningStatusEnum.disabled,
      user: users[0]?.id ?? null,
      encryption: storages.EncryptionAlgorithmEnum.AES256,
    },
    [ObjectContainerOffers.swift]: {
      name: generateName(),
      offer: ObjectContainerOffers.swift,
      region: regions.find((r) => r.name === 'GRA')?.name || '',
      containerType: storages.TypeEnum.static,
      archive: false,
      user: users[0]?.id ?? null,
    },
  };

  const form = useForm<OrderFunnelFormValues>({
    resolver: zodResolver(orderFunnelFormSchema),
    defaultValues: defaultValuesByOffer[ObjectContainerOffers['s3-standard']],
  });

  const { name, offer, region, user } = form.watch();
  const replication = form.watch('replication');
  const versioning = form.watch('versioning');
  const encryption = form.watch('encryption');
  const containerType = form.watch('containerType');
  const currentRegion = regions.find((r) => r.name === region);

  const availableRegions: Region[] = useAvailableRegions({
    regions,
    availabilities,
    options: {
      filterDisabledRegions: offer === ObjectContainerOffers['s3-standard'],
      filterServiceName:
        offer !== ObjectContainerOffers['s3-standard'] ? offer : null,
    },
  });

  const pricings = useOrderPricing({
    availabilities,
    offer,
    region: currentRegion,
    catalog,
    replicationEnabled: !!replication?.enabled,
  });

  // use default values on offer change. Avoid changing name
  useEffect(() => {
    const currentName = name;
    form.reset(defaultValuesByOffer[offer]);
    form.setValue('name', currentName);
  }, [offer]);

  // force replication off
  useEffect(() => {
    if (currentRegion?.type !== RegionTypeEnum['region-3-az']) {
      form.setValue(
        'replication',
        {
          automaticRegionSelection: false,
          enabled: false,
          region: undefined,
        },
        { shouldValidate: true },
      );
    } else {
      form.setValue(
        'replication',
        {
          automaticRegionSelection: true,
          enabled: true,
          region: undefined,
        },
        { shouldValidate: true },
      );
    }
  }, [currentRegion, form]);

  // force versioning if recplication is on
  useEffect(() => {
    if (replication?.enabled) {
      form.setValue('versioning', storages.VersioningStatusEnum.enabled, {
        shouldValidate: true,
      });
    }
  }, [replication, form]);

  // build order model
  const result = useMemo(() => {
    const s3: cloud.StorageContainerCreation & { region: string } = {
      name,
      ownerId: user,
      encryption: {
        sseAlgorithm: encryption,
      },
      versioning: {
        status: versioning,
      },
      region,
    };
    if (replication?.enabled) {
      const rule: storages.ReplicationRuleIn = {
        id: '',
        deleteMarkerReplication:
          storages.ReplicationRuleDeleteMarkerReplicationStatusEnum.enabled,
        status: storages.ReplicationRuleStatusEnum.enabled,
        priority: 1,
      };
      if (replication?.automaticRegionSelection === false) {
        rule.destination = {
          name: '',
          region: replication?.region,
        };
      }
      s3.replication = {
        rules: [rule],
      };
    }

    const swift: cloud.ProjectStorageCreation & {
      containerType: storages.TypeEnum;
    } = {
      containerName: name,
      region,
      archive: false,
      containerType,
    };
    return offer === ObjectContainerOffers['s3-standard'] ? s3 : swift;
  }, [
    offer,
    name,
    user,
    encryption,
    versioning,
    region,
    replication,
    containerType,
  ]);

  return {
    form,
    model: {
      offer,
      currentRegion,
      replication,
    },
    availableRegions,
    pricings,
    result,
  };
}
