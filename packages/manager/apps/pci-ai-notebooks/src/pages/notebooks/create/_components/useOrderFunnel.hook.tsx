import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { useGetFlavor } from '@/hooks/api/ai/capabilities/useGetFlavor.hook';
import { generateName } from '@/lib/nameGenerator';
import { createFlavorPricingList } from '@/lib/priceFlavorHelper';
import { order } from '@/types/catalog';
import * as ai from '@/types/cloud/project/ai';
import { Flavor } from '@/types/orderFunnel';
import { useGetDatastore } from '@/hooks/api/ai/datastore/useGetDatastore.hook';
import { useGetDatastores } from '@/hooks/api/ai/datastore/useGetDatastores.hook';
import { useGetDatastoreContainer } from '@/hooks/api/ai/datastore/useGetDatastoreContainer.hook';
import { useGetStorage } from '@/hooks/api/storage/useGetStorage.hook';

export function useOrderFunnel(
  regions: ai.capabilities.Region[],
  catalog: order.publicOrder.Catalog,
  frameworks: ai.capabilities.notebook.Framework[],
  editors: ai.capabilities.notebook.Editor[],
) {
  const { t } = useTranslation('pci-ai-notebooks/notebooks/create');
  const { projectId } = useParams();
  const orderSchema = z.object({
    region: z.string(),
    flavorWithQuantity: z.object({
      flavor: z.string(),
      quantity: z.number(),
    }),
    frameworkWithVersion: z.object({
      framework: z.string(),
      version: z.string(),
    }),
    editor: z.string(),
    notebookName: z.string().min(1),
    httpsAccess: z.string(),
    labels: z.array(
      z.object({
        key: z.string(),
        value: z.string(),
      }),
    ),
    sshKey: z.array(
      z.object({
        name: z.string(),
        sshKey: z.string(),
      }),
    ),
    // volume
  });

  const form = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      region: regions[0].id,
      flavorWithQuantity: { flavor: '', quantity: 1 },
      frameworkWithVersion: { framework: '', version: '' },
      editor: '',
      notebookName: generateName(),
      privacy: 'private',
      labels: [],
      sshKey: [],
      // volume,
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

  const flavorData = useGetFlavor(projectId, region);

  /*
  const datastoreData = useGetDatastores(projectId, region);
  datastoreData.isSuccess && console.log(datastoreData.data);
  console.log(region);
  const containerData = useGetDatastoreContainer(projectId, region, 'testS3');
  containerData.isSuccess && console.log(containerData.data);
  const storageData = useGetStorage(projectId);
  storageData.isSuccess && console.log(storageData.data);
  */

  const listFlavor: Flavor[] = useMemo(() => {
    if (flavorData.isLoading) return [];
    return createFlavorPricingList(flavorData.data, catalog);
  }, [region, flavorData.isSuccess]);

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
    () => frameworks.find((fmk) => fmk.name === frameworkWithversion.framework),
    [frameworks, frameworkWithversion.framework],
  );
  const versionObject: string | undefined = useMemo(
    () =>
      frameworkObject?.versions.find((v) => v === frameworkWithversion.version),
    [frameworkObject, frameworkWithversion.version],
  );

  const editorObject:
    | ai.capabilities.notebook.Editor
    | undefined = useMemo(() => editors.find((ed) => ed.name === editor), [
    editors,
    editor,
  ]);

  const unsecureHttpObject: boolean = useMemo(() => unsecureHttp === 'public', [
    unsecureHttp,
  ]);
  return {
    form,
    lists: {
      regions,
      flavors: listFlavor,
      frameworks,
      editors,
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
      labels,
      sshKey,
    },
  };
}
