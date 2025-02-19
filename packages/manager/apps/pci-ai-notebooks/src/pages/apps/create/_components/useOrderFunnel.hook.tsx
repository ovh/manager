import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useGetFlavor } from '@/hooks/api/ai/capabilities/useGetFlavor.hook';
import { generateName } from '@/lib/nameGenerator';
import { createFlavorPricingList } from '@/lib/priceFlavorHelper';
import { order } from '@/types/catalog';
import * as ai from '@/types/cloud/project/ai';
import {
  AppGlobalPricing,
  AppSuggestions,
  Flavor,
  ImagePartnerApp,
  PrivacyEnum,
} from '@/types/orderFunnel';
import { useGetDatastores } from '@/hooks/api/ai/datastore/useGetDatastores.hook';
import {
  DataStoresWithContainers,
  useGetDatastoresWithContainers,
} from '@/hooks/api/ai/datastore/useGetDatastoresWithContainers.hook';
import { useGetAppImages } from '@/hooks/api/ai/capabilities/useGetAppImage.hook';
import { createAppImagePricingList } from '@/lib/priceParnterImageHelper';
import { createAppPriceObject } from '@/lib/priceAppHelper';
import { APP_CONFIG } from '@/configuration/app';
import { useGetPartner } from '@/hooks/api/ai/partner/useGetPartner.hook';

export function useOrderFunnel(
  regions: ai.capabilities.Region[],
  catalog: order.publicOrder.Catalog,
  suggestions: AppSuggestions[],
) {
  const { projectId } = useParams();
  const { t } = useTranslation('pci-ai-deploy/apps/create');

  const orderSchema = z.object({
    region: z.string(),
    flavorWithQuantity: z.object({
      flavor: z.string(),
      quantity: z.coerce.number(),
    }),
    image: z.object({
      name: z
        .string()
        .trim()
        .min(1, {
          message: t('errorFormEmptyImageApp'),
        }),
      version: z.string().optional(),
      contractChecked: z.boolean().optional(),
    }),
    appName: z
      .string()
      .trim()
      .min(1),
    privacy: z.nativeEnum(PrivacyEnum),
    scaling: z
      .object({
        scalingStrag: z.boolean().optional(),
        replicas: z.number().optional(),
        averageUsageTarget: z.number().optional(),
        replicasMax: z.number().optional(),
        replicasMin: z.number().optional(),
        resourceType: z
          .nativeEnum(ai.app.ScalingAutomaticStrategyResourceTypeEnum)
          .optional(),
      })
      .optional(),
    labels: z
      .array(
        z.object({
          key: z.string().optional(),
          value: z.string().optional(),
        }),
      )
      .optional(),
    dockerCommand: z.array(z.string()).optional(),
    httpPort: z.coerce
      .number()
      .min(APP_CONFIG.port.min)
      .max(APP_CONFIG.port.max),
    volumes: z.array(
      z.object({
        cache: z.boolean().optional(),
        dataStore: z
          .object({
            alias: z.string(),
            container: z.string(),
          })
          .optional(),
        publicGit: z
          .object({
            url: z.string(),
          })
          .optional(),
        mountPath: z.string(),
        permission: z.nativeEnum(ai.VolumePermissionEnum),
      }),
    ),
    probe: z
      .object({
        path: z
          .string()
          .trim()
          .optional(),
        port: z.coerce.number().optional(),
      })
      .optional(),
  });

  const form = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      region: suggestions[0].region,
      flavorWithQuantity: { flavor: '', quantity: 1 },
      image: { name: '', version: '', contractChecked: false },
      appName: generateName(),
      privacy: PrivacyEnum.private,
      scaling: {
        autoScaling: false,
        replicas: 1,
        averageUsageTarget: 75,
        replicasMax: 1,
        replicasMin: 1,
        resourceType: ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU,
      },
      httpPort: 8080,
      labels: [],
      dockerCommand: [],
      volumes: [],
      probe: { path: '', port: 8080 },
    },
  });

  const region = form.watch('region');
  const flavorWithQuantity = form.watch('flavorWithQuantity');
  const imageWithVersion = form.watch('image');
  const appName = form.watch('appName');
  const unsecureHttp = form.watch('privacy');
  const scaling = form.watch('scaling');
  const httpPort = form.watch('httpPort');
  const labels = form.watch('labels');
  const volumes = form.watch('volumes');
  const dockerCommand = form.watch('dockerCommand');
  const probe = form.watch('probe');

  const flavorQuery = useGetFlavor(projectId, region);
  const datastoreQuery = useGetDatastores(projectId, region);
  const containersQuery = useGetDatastoresWithContainers(
    projectId,
    region,
    datastoreQuery.data,
  );

  const appImagesQuery = useGetAppImages(projectId, region);
  const appPartnerContractQuery = useGetPartner(projectId, region);

  const regionObject: ai.capabilities.Region | undefined = useMemo(
    () => regions.find((r) => r.id === region),
    [regions, region],
  );

  const listFlavor: Flavor[] = useMemo(() => {
    if (flavorQuery.isLoading) return [];
    return createFlavorPricingList(flavorQuery.data, catalog);
  }, [region, flavorQuery.isSuccess]);

  const flavorObject: Flavor | undefined = useMemo(
    () => listFlavor.find((f) => f.id === flavorWithQuantity.flavor),
    [region, listFlavor, flavorWithQuantity.flavor],
  );

  const listAppImages: ImagePartnerApp[] = useMemo(() => {
    if (appImagesQuery.isLoading) return [];
    if (appPartnerContractQuery.isLoading) return [];
    return createAppImagePricingList(
      appImagesQuery.data,
      appPartnerContractQuery.data,
      catalog,
    );
  }, [
    region,
    appImagesQuery.isSuccess,
    appPartnerContractQuery.isSuccess,
    appImagesQuery.data,
    appPartnerContractQuery.data,
  ]);

  const listDatastores: DataStoresWithContainers[] = useMemo(() => {
    if (datastoreQuery.isLoading) return [];
    return containersQuery.data;
  }, [datastoreQuery.isSuccess, containersQuery.data]);

  const unsecureHttpObject: boolean = useMemo(
    () => unsecureHttp === PrivacyEnum.public,
    [unsecureHttp],
  );

  const labelsObject: { [key: string]: string } = useMemo(() => {
    if (labels.length === 0) return {};
    return labels.reduce((acc, label) => {
      acc[label.name] = label.value;
      return acc;
    }, {} as { [key: string]: string });
  }, [labels]);

  // Select default Flavor Id / Flavor number when region change
  useEffect(() => {
    const suggestedFlavor =
      suggestions.find((sug) => sug.region === regionObject.id).ressources
        .flavor ?? listFlavor[0].id;
    form.setValue('flavorWithQuantity.flavor', suggestedFlavor);
    form.setValue('flavorWithQuantity.quantity', 1);
  }, [regionObject, region, flavorQuery.isSuccess]);

  // Pricing Object
  const pricingObject: AppGlobalPricing = useMemo(() => {
    if (!flavorObject || !flavorWithQuantity.quantity) return {};
    return createAppPriceObject(
      imageWithVersion,
      listAppImages,
      scaling,
      flavorObject,
      flavorWithQuantity.quantity,
    );
  }, [
    imageWithVersion.name,
    scaling,
    flavorObject,
    flavorWithQuantity.quantity,
  ]);

  return {
    form,
    lists: {
      regions,
      flavors: listFlavor,
      volumes: listDatastores,
      appImages: listAppImages,
    },
    result: {
      region: regionObject,
      flavor: flavorObject,
      resourcesQuantity: flavorWithQuantity.quantity,
      image: imageWithVersion.name,
      version: imageWithVersion.version,
      contract: imageWithVersion.contractChecked,
      appName,
      unsecureHttp: unsecureHttpObject,
      httpPort,
      volumes,
      scaling,
      labels: labelsObject,
      dockerCommand,
      pricing: pricingObject,
      probe,
    },
  };
}
