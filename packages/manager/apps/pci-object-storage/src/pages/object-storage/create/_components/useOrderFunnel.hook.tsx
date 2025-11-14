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
        enabled: false,
        region: undefined,
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
          enabled: false,
          region: undefined,
        },
        { shouldValidate: true },
      );
    }
  }, [currentRegion, form]);

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
      region,
    };
    // If we are not using localzone, more steps are available
    if (
      regions.find((r) => r.name === region)?.type !== RegionTypeEnum.localzone
    ) {
      s3.ownerId = user;
      s3.encryption = {
        sseAlgorithm: encryption,
      };
      s3.versioning = {
        status: versioning,
      };
    }
    if (replication?.enabled) {
      s3.replication = {
        rules: [
          {
            id: '',
            deleteMarkerReplication:
              storages.ReplicationRuleDeleteMarkerReplicationStatusEnum.enabled,
            status: storages.ReplicationRuleStatusEnum.enabled,
            priority: 1,
            destination: {
              name: '',
              region: replication?.region,
            },
          },
        ],
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
