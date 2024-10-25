import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { s } from 'vitest/dist/reporters-P7C2ytIv';
import { useGetFlavor } from '@/hooks/api/ai/capabilities/useGetFlavor.hook';
import { generateName } from '@/lib/nameGenerator';
import { createFlavorPricingList } from '@/lib/priceFlavorHelper';
import { order } from '@/types/catalog';
import * as ai from '@/types/cloud/project/ai';
import { Flavor, OrderSshKey, PrivacyEnum } from '@/types/orderFunnel';
import { useGetDatastores } from '@/hooks/api/ai/datastore/useGetDatastores.hook';
import {
  DataStoresWithContainers,
  useGetDatastoresWithContainers,
} from '@/hooks/api/ai/datastore/useGetDatastoresWithContainers.hook';

export function useOrderFunnel(
  regions: ai.capabilities.Region[],
  catalog: order.publicOrder.Catalog,
  frameworks: ai.capabilities.notebook.Framework[],
  editors: ai.capabilities.notebook.Editor[],
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
        cache: z.boolean(),
        dataStore: z.object({
          alias: z.string(),
          container: z.string(),
        }),
        mountPath: z.string(),
        permission: z.nativeEnum(ai.VolumePermissionEnum),
      }),
    ),
  });

  const form = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      region: regions[0].id,
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

  const listFlavor: Flavor[] = useMemo(() => {
    if (flavorQuery.isLoading) return [];
    return createFlavorPricingList(flavorQuery.data, catalog);
  }, [region, flavorQuery.isSuccess]);

  const regionObject: ai.capabilities.Region | undefined = useMemo(
    () => regions.find((r) => r.id === region),
    [regions, region],
  );

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
