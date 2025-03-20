import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { generateName } from '@/lib/nameGenerator';
import { createFlavorPricingList } from '@/lib/priceFlavorHelper';
import {
  Flavor,
  JobSuggestions,
  OrderSshKey,
  PrivacyEnum,
} from '@/types/orderFunnel';
import ai from '@/types/AI';
import publicCatalog from '@/types/Catalog';
import { useGetFlavor } from '@/data/hooks/ai/capabilities/useGetFlavor.hook';
import { useGetDatastores } from '@/data/hooks/ai/data/useGetDatastores.hook';
import {
  DataStoresWithContainers,
  useGetDatastoresWithContainers,
} from '@/data/hooks/ai/data/useGetDatastoresWithContainers.hook';

export function useOrderFunnel(
  regions: ai.capabilities.Region[],
  catalog: publicCatalog.Catalog,
  presetImage: ai.job.PresetImage[],
  suggestions: JobSuggestions[],
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
    jobName: z
      .string()
      .trim()
      .min(1),
    privacy: z.nativeEnum(PrivacyEnum),
    dockerCommand: z.array(z.string()).optional(),
    sshKey: z.array(
      z.object({
        name: z.string(),
        sshKey: z.string(),
      }),
    ),
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
      jobName: generateName(),
      privacy: PrivacyEnum.private,
      dockerCommand: [],
      sshKey: [],
      volumes: [],
    },
  });

  const region = form.watch('region');
  const flavorWithQuantity = form.watch('flavorWithQuantity');
  const image = form.watch('image');
  const jobName = form.watch('jobName');
  const unsecureHttp = form.watch('privacy');
  const sshKey = form.watch('sshKey');
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
    return createFlavorPricingList(flavorQuery.data, catalog, 'ai-training');
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

  const publicSshKeyList: string[] = useMemo(() => {
    if (sshKey.length === 0) return [];
    return sshKey.map((key: OrderSshKey) => key.sshKey);
  }, [sshKey]);

  // Select default Flavor Id / Flavor number when region change
  useEffect(() => {
    const suggestedFlavor =
      suggestions.find((sug) => sug.region === regionObject.id).ressources
        .flavor ?? listFlavor[0].id;
    form.setValue('flavorWithQuantity.flavor', suggestedFlavor);
    form.setValue('flavorWithQuantity.quantity', 1);
  }, [regionObject, region, flavorQuery.isSuccess]);

  // Change editors when region change?
  useEffect(() => {
    const suggestedImage =
      suggestions.find((sug) => sug.region === regionObject.id).image ??
      presetImage[0].id;
    form.setValue('image', suggestedImage);
  }, [regionObject, region]);

  return {
    form,
    lists: {
      regions,
      flavors: listFlavor,
      presetImage,
      volumes: listDatastores,
    },
    result: {
      region: regionObject,
      flavor: flavorObject,
      resourcesQuantity: flavorWithQuantity.quantity,
      image,
      jobName,
      unsecureHttp: unsecureHttpObject,
      sshKey: publicSshKeyList,
      volumes,
      dockerCommand,
    },
  };
}
