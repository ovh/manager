import { order } from '@/models/catalog';
import { ai /*user */ } from '@/models/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
//import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { FlavorWithRegion } from './api/ai/useGetFlavors';
import { Flavor } from '@/models/order-funnel';
import { createFlavorList } from '@/lib/notebookFlavorsHelper';
import { ConvertPricing } from '@/data/constant';

export function useNotebookOrderFunnel(
  frameworks: ai.notebook.Framework[],
  editors: ai.notebook.Editor[],
  regions: ai.capabilities.Region[],
  flavorsWithRegion: FlavorWithRegion[],
  //sshKeys: user.SSHKey[],
  //volumes
  catalog: order.publicOrder.Catalog,
) {
  //const { t } = useTranslation('pci-ai/notebooks/new');
  //const { projectId } = useParams();
  const orderSchema = z.object({
    name: z.string(),
    labels: z.object({
      name: z.string(),
      value: z.string(),
    }),
    frameworkWithVersion: z.object({
      framework: z.string(),
      version: z.string(),
    }),
    editor: z.string(),
    region: z.string(),
    unsecureHttp: z.boolean(),
    flavors: z.object({
      flavor: z.string(),
      number: z.number(),
    }),
    //sshKey[]
    //volumes[]
  });
  const form = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      name: '',
      labels: { name: '', value: '' },
      frameworkWithVersion: {
        framework: frameworks[0].id,
        version: frameworks[0].versions[0],
      },
      editor: editors[0].id,
      region: regions[0].id,
      unsecureHttp: false,
      flavors: { number: 1, flavor: flavorsWithRegion.find((flav) => flav.region === regions[0].id && flav.type === ai.capabilities.FlavorTypeEnum.cpu && flav.default)?.id},
      //sshkey
      //Volumes
    },
  });

  const name = form.watch('name');
  const labels = form.watch('labels');
  const frameworkWithVersion = form.watch('frameworkWithVersion');
  const editor = form.watch('editor');
  const region = form.watch('region');
  const unsecureHttp = form.watch('unsecureHttp');
  const flavors = form.watch('flavors');
  //sshKey
  //volumes

  const [price, setPrice] = useState("");
  const [tax, setTax] = useState("");

  const listFrameworks: ai.notebook.Framework[] = frameworks;
  const listEditors: ai.notebook.Editor[] = editors;
  const listRegions: ai.capabilities.Region[] = regions;

  debugger;
  console.log("liste FlavorsWithRegion");
  console.log(flavorsWithRegion);

  const listFlavors = useMemo(
    () =>
      createFlavorList(flavorsWithRegion, region || listRegions[0].id, catalog),
    [region],
  );

  console.log(listFlavors);

  const frameworkObject: ai.notebook.Framework | undefined = useMemo(
    () =>
      listFrameworks.find((e) => e.id === frameworkWithVersion.framework) ||
      listFrameworks[0],
    [listFrameworks, frameworkWithVersion.framework],
  );

  console.log(frameworkObject);

  const versionObject: string | undefined = useMemo(
    () =>
      frameworkObject?.versions.find((v) => v === frameworkWithVersion.version),
    [frameworkObject, frameworkWithVersion.version],
  );

  console.log(versionObject);

  const flavorObject: Flavor | undefined = useMemo(
    () =>
      listFlavors.find((e) => e.id === flavors.flavor) ||
      listFlavors.find((e) => e.default),
    [listFlavors, flavors.flavor],
  );

  console.log(flavorObject);

  const editorObject: ai.notebook.Editor | undefined = useMemo(
    () =>
      listEditors.find((e) => e.id === editor) ||
      listEditors[0],
    [listEditors, editor],
  );

  console.log(editorObject);

  //compute Pricing when resources change
  useEffect(() => {
    debugger;
    if (!flavors) return;
    if (flavorObject) {
      const newPrice = ConvertPricing(flavorObject.pricing, false, flavors.number);
      const newTax= ConvertPricing(flavorObject.pricing, true, flavors.number);
      setPrice(newPrice);
      setTax(newTax);
    }   
  }, [flavorObject, flavors, region]);

  //select Flavor when region change
  useEffect(() => {
    debugger;
    if (!listFlavors) return;
    const flavorAndNumber = { flavor: '', number: 1 };
    const defaultFlavor = listFlavors.find(
      (flav) =>
        flav.default && flav.type === ai.capabilities.FlavorTypeEnum.cpu,
    );
    if (defaultFlavor) {
      flavorAndNumber.flavor = defaultFlavor?.id;
    } else if (listFlavors.length > 0) {
      flavorAndNumber.flavor = listFlavors[0].id;
    }
    form.setValue('flavors', flavorAndNumber);
  }, [region]);

  return {
    form,
    lists: {
      frameworks: listFrameworks,
      editors: listEditors,
      regions: listRegions,
      flavors: listFlavors,
    },
    result: {
      name,
      labels,
      price,
      tax,
      unsecureHttp,
      framework: frameworkObject,
      version: versionObject,
      editor: editorObject,
      region,
      flavor: {
       flavor: flavorObject,
       number: flavors.number 
      },

      //sshKeys
      //volume
    },
  };
}
