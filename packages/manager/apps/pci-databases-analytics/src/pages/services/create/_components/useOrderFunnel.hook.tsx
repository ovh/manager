import { useEffect, useState, useMemo } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as database from '@/types/cloud/project/database';
import { Engine, Flavor, Plan, Region, Version } from '@/types/orderFunnel';
import { order } from '@/types/catalog';
import { createTree } from '@/lib/availabilitiesHelper';
import { generateName } from '@/lib/nameGenerator';
import { useVrack } from '@/hooks/useVrack';
import { FullCapabilities } from '@/hooks/api/database/capabilities/useGetFullCapabilities.hook';
import { ServicePricing, computeServicePrice } from '@/lib/pricingHelper';

const getSuggestedItemOrDefault = (
  suggestion: database.availability.Suggestion,
  item: 'plan' | 'region' | 'flavor' | 'version',
  listItems: Plan[] | Region[] | Flavor[] | Version[],
  currentValue?: string,
) => {
  if (listItems.length === 0) return '';
  const suggestedItem = suggestion[item];
  // return current value is possible, to avoid changing user selection
  if (currentValue && listItems.find((i) => i.name === currentValue)) {
    return currentValue;
  }
  // otherwise, use default, or first
  return listItems.find((i) => i.name === suggestedItem)
    ? suggestedItem
    : listItems[0].name;
};

export function useOrderFunnel(
  availabilities: database.Availability[],
  capabilities: FullCapabilities,
  suggestions: database.availability.Suggestion[],
  catalog: order.publicOrder.Catalog,
) {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  const { projectId } = useParams();
  const orderSchema = z.object({
    engine: z.string(),
    version: z.string(),
    plan: z.string(),
    region: z.string(),
    flavor: z.string(),
    additionalStorage: z.number(),
    nbNodes: z.number(),
    ipRestrictions: z.array(
      z.object({
        ip: z.string(),
        description: z.string(),
      }),
    ),
    network: z
      .object({
        type: z.enum([
          database.NetworkTypeEnum.public,
          database.NetworkTypeEnum.private,
        ]),
        networkId: z.string().optional(),
        subnetId: z.string().optional(),
      })
      .refine(
        (data) => {
          if (data.type === database.NetworkTypeEnum.private) {
            return data.networkId !== undefined && data.subnetId !== undefined;
          }
          return true;
        },
        {
          message: t('errorNetworkFieldMissingId'),
        },
      ),
    name: z
      .string()
      .min(1)
      .max(50),
  });
  type OrderFormValues = z.infer<typeof orderSchema>;
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      name: generateName(),
      engine: '',
      version: '',
      plan: '',
      region: '',
      flavor: '',
      nbNodes: 0,
      additionalStorage: 0,
      ipRestrictions: [],
      network: {
        type: database.NetworkTypeEnum.public,
        networkId: undefined,
        subnetId: undefined,
      },
    },
  });

  const name = form.watch('name');
  const engine = form.watch('engine');
  const version = form.watch('version');
  const plan = form.watch('plan');
  const region = form.watch('region');
  const flavor = form.watch('flavor');
  const nbNodes = form.watch('nbNodes');
  const additionalStorage = form.watch('additionalStorage');
  const ips = form.watch('ipRestrictions');
  const network = form.watch('network');

  const networksData = useVrack(projectId, region, network.networkId);

  const [price, setPrice] = useState<ServicePricing>({
    flavorPrice: {
      hourly: { price: 0, tax: 0 },
      monthly: { price: 0, tax: 0 },
    },
    servicePrice: {
      hourly: { price: 0, tax: 0 },
      monthly: { price: 0, tax: 0 },
    },
    storagePrice: {
      hourly: { price: 0, tax: 0 },
      monthly: { price: 0, tax: 0 },
    },
  });

  // Create the list of available engines
  const listEngines = useMemo(
    () =>
      createTree(availabilities, capabilities, suggestions, catalog).map(
        (e) => {
          // order the versions in the engines
          e.versions.sort((a, b) => a.order - b.order);
          return e;
        },
      ),
    [availabilities, capabilities],
  );
  // Create the list of available versions
  const listVersions = useMemo(
    () =>
      listEngines
        ?.find((e: Engine) => e.name === engine)
        ?.versions.sort((a, b) => a.order - b.order) || [],
    [listEngines, engine],
  );
  // Create the list of available regions
  const listRegions = useMemo(
    () =>
      listVersions
        ?.find((v: Version) => v.name === version)
        ?.regions.sort((a, b) => a.order - b.order) || [],
    [listVersions, version],
  );
  // Create the list of available plans
  const listPlans = useMemo(
    () =>
      listRegions
        ?.find((r: Region) => r.name === region)
        ?.plans.sort((a, b) => a.order - b.order) || [],
    [listRegions, region],
  );

  // Create the list of available flavors
  const listFlavors = useMemo(
    () =>
      listPlans
        ?.find((p: Plan) => p.name === plan)
        ?.flavors.sort((a, b) => a.order - b.order) || [],
    [listPlans, plan],
  );

  const engineObject: Engine | undefined = useMemo(
    () => listEngines.find((e) => e.name === engine),
    [listEngines, engine],
  );
  const versionObject: Version | undefined = useMemo(
    () => listVersions.find((v) => v.name === version),
    [listVersions, version],
  );
  const planObject: Plan | undefined = useMemo(
    () => listPlans.find((p) => p.name === plan),
    [listPlans, plan],
  );
  const regionObject: Region | undefined = useMemo(
    () => listRegions.find((r) => r.name === region),
    [listRegions, region],
  );
  const flavorObject: Flavor | undefined = useMemo(
    () => listFlavors.find((f) => f.name === flavor),
    [listFlavors, flavor],
  );
  const networkObject = useMemo(
    () => ({
      type: network.type,
      network: networksData.networks.find((n) => n.id === network.networkId),
      subnet: networksData.subnets.find((s) => s.id === network.subnetId),
    }),
    [network, networksData],
  );

  // find the availability corresponding to selected items
  const availability: database.Availability | undefined = useMemo(
    () =>
      availabilities.find(
        (a) =>
          a.engine === engine &&
          a.version === version &&
          a.region === region &&
          a.plan === plan &&
          a.specifications.flavor === flavor,
      ),
    [availabilities, engine, version, region, plan, flavor],
  );

  // compute pricing when availability, nbNodes and additionalStorage changes
  useEffect(() => {
    if (!availability) return;
    setPrice(
      computeServicePrice({
        offerPricing: flavorObject.pricing,
        nbNodes,
        storagePricing: flavorObject.storage?.pricing,
        additionalStorage,
        storageMode: engineObject.storageMode,
      }),
    );
  }, [availability, nbNodes, additionalStorage, engineObject]);

  useEffect(() => {
    const suggestedEngine = suggestions.find((s) => s.default);
    const defaultEngine =
      listEngines.find((e) => e.name === suggestedEngine.engine) ??
      listEngines[0];
    form.setValue('engine', defaultEngine.name);
  }, [listEngines, suggestions]);
  // update version
  useEffect(() => {
    form.setValue(
      'version',
      getSuggestedItemOrDefault(
        suggestions.find((s) => s.engine === engine),
        'version',
        listVersions,
      ),
    );
  }, [listVersions, suggestions, engine]);
  // update region
  useEffect(() => {
    form.setValue(
      'region',
      getSuggestedItemOrDefault(
        suggestions.find((s) => s.engine === engine),
        'region',
        listRegions,
        region,
      ),
    );
  }, [listRegions, suggestions, engine, region]);
  // update plan
  useEffect(() => {
    form.setValue(
      'plan',
      getSuggestedItemOrDefault(
        suggestions.find((s) => s.engine === engine),
        'plan',
        listPlans,
        plan,
      ),
    );
  }, [listPlans, suggestions, engine, plan]);
  // update nodes when plan changes
  useEffect(() => {
    if (!planObject) return;
    form.setValue('nbNodes', planObject.nodes.minimum);
  }, [plan, listPlans]);
  // update flavor
  useEffect(() => {
    form.setValue(
      'flavor',
      getSuggestedItemOrDefault(
        suggestions.find((s) => s.engine === engine),
        'flavor',
        listFlavors,
        flavor,
      ),
    );
  }, [listFlavors, suggestions, engine, flavor]);
  // reset storage when flavor is changed
  useEffect(() => {
    form.setValue('additionalStorage', 0);
  }, [flavor]);

  // upate the network selection when network list changes
  useEffect(() => {
    const newNetworkValues = { ...network };
    newNetworkValues.networkId = networksData.networks[0]?.id ?? undefined;
    form.setValue('network', newNetworkValues);
  }, [networksData.networks]);
  // upadte the sublist selection when subnet list changes
  useEffect(() => {
    const newNetworkValues = { ...network };
    newNetworkValues.subnetId = networksData.subnets[0]?.id ?? undefined;
    form.setValue('network', newNetworkValues);
  }, [networksData.subnets]);
  // set network to public if it is the only value possible
  useEffect(() => {
    if (
      planObject &&
      !planObject.networks.includes(database.NetworkTypeEnum.private)
    ) {
      form.setValue('network', { type: database.NetworkTypeEnum.public });
    }
  }, [planObject]);

  return {
    form,
    queries: {
      networks: networksData.networkQuery,
      subnets: networksData.subnetQuery,
    },
    lists: {
      engines: listEngines,
      versions: listVersions,
      plans: listPlans,
      regions: listRegions,
      flavors: listFlavors,
      networks: networksData.networks,
      subnets: networksData.subnets,
    },
    result: {
      availability,
      price,
      name,
      engine: engineObject,
      version: versionObject,
      plan: planObject,
      region: regionObject,
      flavor: flavorObject,
      nodes: nbNodes,
      additionalStorage,
      ipRestrictions: ips,
      network: networkObject,
    },
  };
}
