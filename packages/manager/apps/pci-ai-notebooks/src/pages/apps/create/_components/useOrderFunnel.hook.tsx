import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { useGetFlavor } from '@/hooks/api/ai/capabilities/useGetFlavor.hook';
import { generateName } from '@/lib/nameGenerator';
import { createFlavorPricingList } from '@/lib/priceFlavorHelper';
import { order } from '@/types/catalog';
import * as ai from '@/types/cloud/project/ai';
import { AppSuggestions, Flavor, PrivacyEnum } from '@/types/orderFunnel';
import { useGetDatastores } from '@/hooks/api/ai/datastore/useGetDatastores.hook';
import {
  DataStoresWithContainers,
  useGetDatastoresWithContainers,
} from '@/hooks/api/ai/datastore/useGetDatastoresWithContainers.hook';

export function useOrderFunnel(
  regions: ai.capabilities.Region[],
  catalog: order.publicOrder.Catalog,
  suggestions: AppSuggestions[],
) {
  const { projectId } = useParams();
  const orderSchema = z.object({
    region: z.string(),
    flavorWithQuantity: z.object({
      flavor: z.string(),
      quantity: z.coerce.number(),
    }),
    image: z
      .string()
      .trim()
      .min(1),
    appName: z
      .string()
      .trim()
      .min(1),
    privacy: z.nativeEnum(PrivacyEnum),
    labels: z
      .array(
        z.object({
          key: z.string().optional(),
          value: z.string().optional(),
        }),
      )
      .optional(),
    dockerCommand: z.array(z.string()).optional(),
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
  });

  const form = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      region: suggestions[0].region,
      flavorWithQuantity: { flavor: '', quantity: 1 },
      image: '',
      appName: generateName(),
      privacy: PrivacyEnum.private,
      labels: [],
      dockerCommand: [],
      volumes: [],
    },
  });

  const region = form.watch('region');
  const flavorWithQuantity = form.watch('flavorWithQuantity');
  const image = form.watch('image');
  const appName = form.watch('appName');
  const unsecureHttp = form.watch('privacy');
  const labels = form.watch('labels');
  const volumes = form.watch('volumes');
  const dockerCommand = form.watch('dockerCommand');

  const flavorQuery = useGetFlavor(projectId, region);
  const datastoreQuery = useGetDatastores(projectId, region);
  const containersQuery = useGetDatastoresWithContainers(
    projectId,
    region,
    datastoreQuery.data,
  );

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

  // // Change editors when region change?
  // useEffect(() => {
  //   const suggestedImage =
  //     suggestions.find((sug) => sug.region === regionObject.id).image ??
  //     presetImage[0].id;
  //   form.setValue('image', suggestedImage);
  // }, [regionObject, region]);

  return {
    form,
    lists: {
      regions,
      flavors: listFlavor,
      volumes: listDatastores,
    },
    result: {
      region: regionObject,
      flavor: flavorObject,
      resourcesQuantity: flavorWithQuantity.quantity,
      image,
      appName,
      unsecureHttp: unsecureHttpObject,
      volumes,
      labels: labelsObject,
      dockerCommand,
    },
  };
}
