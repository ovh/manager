import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import {
  Flavor,
  OrderSshKey,
  PrivacyEnum,
  Suggestions,
} from '@/types/orderFunnel';
import ai from '@/types/AI';

import { generateName } from '@/lib/nameGenerator';
import { useGetDatastores } from '@/data/hooks/ai/data/useGetDatastores.hook';
import {
  DataStoresWithContainers,
  useGetDatastoresWithContainers,
} from '@/data/hooks/ai/data/useGetDatastoresWithContainers.hook';
import { useGetFlavor } from '@/data/hooks/ai/capabilities/useGetFlavor.hook';
import { createFlavorPricingList } from '@/lib/priceFlavorHelper';
import publicCatalog from '@/types/Catalog';

export function useOrderFunnel(
  regions: ai.capabilities.Region[],
  catalog: publicCatalog.Catalog,
  frameworks: ai.capabilities.notebook.Framework[],
  editors: ai.capabilities.notebook.Editor[],
  suggestions: Suggestions[],
) {
  const { projectId } = useParams();
  const orderSchema = z.object({
    region: z.string(),
    flavorWithQuantity: z.object({
      flavor: z.string(),
      quantity: z.coerce.number(),
    }),
    frameworkWithVersion: z.object({
      framework: z.string(),
      version: z.string(),
    }),
    editor: z.string(),
    notebookName: z.string().min(1),
    privacy: z.nativeEnum(PrivacyEnum),
    labels: z
      .array(
        z.object({
          key: z.string().optional(),
          value: z.string().optional(),
        }),
      )
      .optional(),
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
      frameworkWithVersion: { framework: '', version: '' },
      editor: '',
      notebookName: generateName(),
      privacy: PrivacyEnum.private,
      labels: [],
      sshKey: [],
      volumes: [],
    },
  });

  const region = form.watch('region');
  const flavorWithQuantity = form.watch('flavorWithQuantity');
  const frameworkWithversion = form.watch('frameworkWithVersion');
  const editor = form.watch('editor');
  const notebookName = form.watch('notebookName');
  const unsecureHttp = form.watch('privacy');
  const labels = form.watch('labels');
  const sshKey = form.watch('sshKey');
  const volumes = form.watch('volumes');

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
    return createFlavorPricingList(flavorQuery.data, catalog, 'ai-notebook');
  }, [region, flavorQuery.isSuccess]);

  const flavorObject: Flavor | undefined = useMemo(
    () => listFlavor.find((f) => f.id === flavorWithQuantity.flavor),
    [region, listFlavor, flavorWithQuantity.flavor],
  );

  const frameworkObject:
    | ai.capabilities.notebook.Framework
    | undefined = useMemo(
    () => frameworks.find((fmk) => fmk.id === frameworkWithversion.framework),
    [frameworks, frameworkWithversion.framework],
  );
  const versionObject: string | undefined = useMemo(
    () =>
      frameworkObject?.versions.find((v) => v === frameworkWithversion.version),
    [frameworkObject, frameworkWithversion.version],
  );

  const editorObject:
    | ai.capabilities.notebook.Editor
    | undefined = useMemo(() => editors.find((ed) => ed.id === editor), [
    editors,
    editor,
  ]);

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

  // Change Framework when region change?
  useEffect(() => {
    const suggestedFramework =
      suggestions.find((sug) => sug.region === regionObject.id).framework.id ??
      frameworks[0].id;
    const suggestedFrameworkVersion =
      suggestions.find((sug) => sug.region === regionObject.id).framework
        .version ?? frameworks[0].versions[0];
    form.setValue('frameworkWithVersion.framework', suggestedFramework);
    form.setValue('frameworkWithVersion.version', suggestedFrameworkVersion);
  }, [regionObject, region]);

  // Change editors when region change?
  useEffect(() => {
    const suggestedEditors =
      suggestions.find((sug) => sug.region === regionObject.id).editorId ??
      editors[0].id;
    form.setValue('editor', suggestedEditors);
  }, [regionObject, region]);

  return {
    form,
    lists: {
      regions,
      flavors: listFlavor,
      frameworks,
      editors,
      volumes: listDatastores,
    },
    result: {
      region: regionObject,
      flavor: flavorObject,
      resourcesQuantity: flavorWithQuantity.quantity,
      framework: frameworkObject,
      version: versionObject,
      editor: editorObject,
      notebookName,
      unsecureHttp: unsecureHttpObject,
      labels: labelsObject,
      sshKey: publicSshKeyList,
      volumes,
    },
  };
}
