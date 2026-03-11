import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { generateName } from '@/lib/nameGenerator';
import { createFlavorPricingList } from '@/lib/priceFlavorHelper';
import ai from '@/types/AI';
import {
  AppGlobalPricing,
  AppSuggestions,
  Flavor,
  ImagePartnerApp,
  PrivacyEnum,
  Scaling,
} from '@/types/orderFunnel';
import { createAppImagePricingList } from '@/lib/pricePartnerImageHelper';
import { createAppPriceObject } from '@/lib/priceAppHelper';
import { APP_CONFIG } from '@/configuration/app';
import publicCatalog from '@/types/Catalog';
import {
  baseScalingSchema,
  getInitialValues,
  useScalingStrategyForm,
  withScalingResolverSync,
} from '@/components/order/app-scaling/scalingHelper';
import { useGetFlavor } from '@/data/hooks/ai/capabilities/useGetFlavor.hook';
import { useGetDatastores } from '@/data/hooks/ai/data/useGetDatastores.hook';
import {
  DataStoresWithContainers,
  useGetDatastoresWithContainers,
} from '@/data/hooks/ai/data/useGetDatastoresWithContainers.hook';
import { useGetAppImages } from '@/data/hooks/ai/capabilities/useGetAppImage.hook';
import { useGetPartner } from '@/data/hooks/ai/partner/useGetPartner.hook';

export function useOrderFunnel(
  regions: ai.capabilities.Region[],
  catalog: publicCatalog.Catalog,
  suggestions: AppSuggestions,
) {
  const { projectId } = useParams();
  const { t } = useTranslation('ai-tools/apps/create');
  const { t: tScaling } = useTranslation('ai-tools/components/scaling');

  const orderSchema = useMemo(
    () =>
      z
        .object({
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
          labels: z
            .array(
              z.object({
                name: z.string().optional(),
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
        })
        .and(baseScalingSchema(tScaling)),
    [t, tScaling],
  );
  type OrderFormValues = z.infer<typeof orderSchema>;

  const form = useForm<OrderFormValues>({
    resolver: withScalingResolverSync(
      zodResolver(orderSchema) as Resolver<OrderFormValues>,
    ),
    mode: 'onChange',
    defaultValues: {
      region: suggestions.defaultRegion,
      flavorWithQuantity: { flavor: '', quantity: 1 },
      image: { name: '', version: '', contractChecked: false },
      appName: generateName(),
      privacy: suggestions.suggestions.find(
        (sug) => sug.region === suggestions.defaultRegion,
      ).unsecureHttp
        ? PrivacyEnum.private
        : PrivacyEnum.public,
      ...getInitialValues({}),
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
  const httpPort = form.watch('httpPort');
  const labels = form.watch('labels');
  const volumes = form.watch('volumes');
  const dockerCommand = form.watch('dockerCommand');
  const probe = form.watch('probe');
  const autoScaling = form.watch('autoScaling');
  const replicas = form.watch('replicas');
  const averageUsageTarget = form.watch('averageUsageTarget');
  const replicasMin = form.watch('replicasMin');
  const replicasMax = form.watch('replicasMax');
  const cooldownPeriodSeconds = form.watch('cooldownPeriodSeconds');
  const scaleUpStabilizationWindowSeconds = form.watch(
    'scaleUpStabilizationWindowSeconds',
  );
  const scaleDownStabilizationWindowSeconds = form.watch(
    'scaleDownStabilizationWindowSeconds',
  );
  const resourceType = form.watch('resourceType');
  const metricUrl = form.watch('metricUrl');
  const dataFormat = form.watch('dataFormat');
  const dataLocation = form.watch('dataLocation');
  const targetMetricValue = form.watch('targetMetricValue');
  const aggregationType = form.watch('aggregationType');

  const scaling: Scaling = {
    autoScaling,
    replicas,
    averageUsageTarget,
    replicasMax: replicasMax as number | undefined,
    replicasMin: replicasMin as number | undefined,
    cooldownPeriodSeconds: cooldownPeriodSeconds as number | undefined,
    scaleUpStabilizationWindowSeconds:
      scaleUpStabilizationWindowSeconds as number | undefined,
    scaleDownStabilizationWindowSeconds:
      scaleDownStabilizationWindowSeconds as number | undefined,
    resourceType,
    metricUrl: metricUrl as string | undefined,
    dataFormat,
    dataLocation,
    targetMetricValue: targetMetricValue as number | undefined,
    aggregationType,
  };
  const scalingState = useScalingStrategyForm(form);

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
    return createFlavorPricingList(flavorQuery.data, catalog, 'ai-app');
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
    return labels.reduce((acc: { [key: string]: string }, label: any) => {
      acc[label.name] = label.value;
      return acc;
    }, {} as { [key: string]: string });
  }, [labels]);

  const isContractSigned: boolean = useMemo(() => {
    if (!imageWithVersion.version) return true;
    return !!listAppImages.find((app) => app.id === imageWithVersion.name)
      .contract.signedAt;
  }, [imageWithVersion.name, imageWithVersion.version]);

  useEffect(() => {
    const suggestedFlavor =
      suggestions.suggestions.find((sug) => sug.region === regionObject.id)
        .resources.flavorId ?? listFlavor[0].id;
    const suggestedQuantity =
      suggestions.suggestions.find((sug) => sug.region === regionObject.id)
        .resources.quantity ?? 1;
    form.setValue('flavorWithQuantity.flavor', suggestedFlavor);
    form.setValue('flavorWithQuantity.quantity', suggestedQuantity);
  }, [regionObject, region, flavorQuery.isSuccess]);

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
      isContractChecked: imageWithVersion.contractChecked,
      isContractSigned,
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
    scalingState: {
      autoScaling: scaling.autoScaling,
      averageUsageTargetValue: scalingState.averageUsageTargetValue,
      isCustom: scalingState.isCustom,
      syncReplicasMaxFromMin: scalingState.syncReplicasMaxFromMin,
      showScaleToZero: scalingState.showScaleToZero,
    },
  };
}
