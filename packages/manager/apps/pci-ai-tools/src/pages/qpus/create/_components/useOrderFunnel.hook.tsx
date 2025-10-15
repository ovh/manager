import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import {
  Flavor,
  NotebookSuggestions,
  OrderSshKey,
  PrivacyEnum,
  Qpu,
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
import { useGetFramework } from '@/data/hooks/ai/capabilities/useGetFramework.hook';
import { useGetEditor } from '@/data/hooks/ai/capabilities/useGetEditor.hook';
import { useQuantum } from '@/hooks/useQuantum.hook';
import { createQPUFlavorPricingList } from '@/lib/priceQPUFlavorHelper';
import { useGetQPUFlavors } from '@/data/hooks/ai/capabilities/useGetQPUFlavors.hook';

export function useOrderFunnel(
  regions: ai.capabilities.Region[],
  catalog: publicCatalog.Catalog,
  suggestions: NotebookSuggestions,
) {
  const { projectId } = useParams();
  const { isQuantum } = useQuantum();
  const orderSchema = z.object({
    region: z.string(),
    flavorWithQuantity: z.object({
      flavor: z.string(),
      quantity: z.coerce.number(),
    }),
    QPUFlavor: z.string().optional(),
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
          name: z.string().min(1),
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
      region: suggestions.defaultRegion,
      flavorWithQuantity: { flavor: '', quantity: 1 },
      frameworkWithVersion: { framework: '', version: '' },
      QPUFlavor: '',
      editor: '',
      notebookName: generateName(),
      privacy: suggestions.suggestions.find(
        (sug) => sug.region === suggestions.defaultRegion,
      ).unsecureHttp
        ? PrivacyEnum.private
        : PrivacyEnum.public,
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
  const QPUFlavorId = form.watch('QPUFlavor');

  const frameworkQuery = useGetFramework(projectId, region);
  const editorQuery = useGetEditor(projectId, region);
  const flavorQuery = useGetFlavor(projectId, region);
  const QPUFlavorQuery = useGetQPUFlavors(projectId, region);
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

  const listFramework: ai.capabilities.notebook.Framework[] = useMemo(() => {
    if (frameworkQuery.isLoading) return [];
    return frameworkQuery.data.filter((fmk) => fmk.type === 'quantum-qpu');
  }, [region, frameworkQuery.isSuccess]);

  const listEditor: ai.capabilities.notebook.Editor[] = useMemo(() => {
    if (editorQuery.isLoading) return [];
    return editorQuery.data;
  }, [region, editorQuery.isSuccess]);

  const flavorObject: Flavor | undefined = useMemo(
    () => listFlavor.find((f) => f.id === flavorWithQuantity.flavor),
    [region, listFlavor, flavorWithQuantity.flavor],
  );

  const frameworkObject:
    | ai.capabilities.notebook.Framework
    | undefined = useMemo(
    () =>
      listFramework.find((fmk) => fmk.id === frameworkWithversion.framework),
    [listFramework, frameworkWithversion.framework],
  );

  const listQpuFlavor: Qpu[] = useMemo(() => {
    if (QPUFlavorQuery.isLoading) return [];
    const allQpus = createQPUFlavorPricingList(
      QPUFlavorQuery.data,
      catalog,
      'quantum-processing-unit',
    );
    if (!frameworkObject || !frameworkObject.supportedQpus) return [];
    return allQpus.filter((qpu) =>
      frameworkObject.supportedQpus?.includes(qpu.id),
    );
  }, [region, QPUFlavorQuery.isSuccess, QPUFlavorQuery.data, frameworkObject]);

  const QpuflavorObject: Qpu | undefined = useMemo(() => {
    if (!listQpuFlavor?.length) return undefined;
    return listQpuFlavor.find((qpu) => qpu.id === QPUFlavorId);
  }, [listQpuFlavor, QPUFlavorId]);

  const versionObject: string | undefined = useMemo(
    () =>
      frameworkObject?.versions?.find(
        (v) => v === frameworkWithversion?.version,
      ),
    [frameworkObject, frameworkWithversion?.version],
  );

  const editorObject:
    | ai.capabilities.notebook.Editor
    | undefined = useMemo(() => listEditor.find((ed) => ed.id === editor), [
    listEditor,
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
      suggestions.suggestions.find((sug) => sug.region === regionObject.id)
        .resources.flavorId ?? listFlavor[0].id;
    const suggestedQuantity =
      suggestions.suggestions.find((sug) => sug.region === regionObject.id)
        .resources.quantity ?? 1;
    form.setValue('flavorWithQuantity.flavor', 'ai1-1-cpu');
    form.setValue('flavorWithQuantity.quantity', suggestedQuantity);
  }, [regionObject, region, flavorQuery.isSuccess]);

  // Change Framework when region change?
  useEffect(() => {
    if (!frameworkQuery.isSuccess) return;
    form.setValue('frameworkWithVersion.framework', listFramework[0].id);
    form.setValue('frameworkWithVersion.version', listFramework[0].versions[0]);
  }, [regionObject, region, listFramework]);

  // Change editors when region change?
  useEffect(() => {
    const suggestedEditors =
      suggestions.suggestions.find((sug) => sug.region === regionObject.id)
        .editor.id ?? listEditor[0].id;
    form.setValue('editor', suggestedEditors);
  }, [regionObject, region, listEditor]);

  return {
    form,
    lists: {
      regions,
      flavors: listFlavor,
      frameworks: listFramework,
      editors: listEditor,
      volumes: listDatastores,
      qpuFlavors: listQpuFlavor,
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
      QPUFlavor: QpuflavorObject,
    },
  };
}
