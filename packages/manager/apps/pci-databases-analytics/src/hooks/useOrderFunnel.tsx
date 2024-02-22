import { useEffect, useState, useMemo } from 'react';
import { database } from '@/models/database';
import { Engine, Flavor, Plan, Region, Version } from '@/models/order-funnel';
import { order } from '@/models/catalog';
import { createTree } from '@/lib/availabilitiesHelper';

const getSuggestedItemOrDefault = (
  suggestion: database.Suggestion,
  item: 'plan' | 'region' | 'flavor',
  listItems: Plan[] | Region[] | Flavor[],
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
  capabilities: database.Capabilities,
  engineCapabilities: database.EngineCapabilities[],
  regionCapabilities: database.RegionCapabilities[],
  suggestions: database.Suggestion[],
  catalog: order.publicOrder.Catalog,
) {
  const [engineWithVersion, setEngineWithVersion] = useState({
    engine: '',
    version: '',
  });
  const [plan, setPlan] = useState('');
  const [region, setRegion] = useState('');
  const [flavor, setFlavor] = useState('');

  const [nbNodes, setNbNodes] = useState(0);
  const [additionalStorage, setAdditionalStorage] = useState(0);

  const [price, setPrice] = useState({
    hourly: { price: 0, tax: 0 },
    monthly: { price: 0, tax: 0 },
  });

  // Create the list of available engines
  const listEngines = useMemo(
    () =>
      createTree(
        availabilities,
        capabilities,
        engineCapabilities,
        regionCapabilities,
        suggestions,
        catalog,
      ),
    [availabilities, capabilities],
  );
  // Create the list of available plans
  const listPlans = useMemo(
    () =>
      listEngines
        ?.find((e: Engine) => e.name === engineWithVersion.engine)
        ?.versions.find((v: Version) => v.name === engineWithVersion.version)
        ?.plans || [],
    [listEngines, engineWithVersion],
  );
  // Create the list of available regions
  const listRegions = useMemo(
    () => listPlans?.find((p: Plan) => p.name === plan)?.regions || [],
    [listPlans, plan],
  );
  // Create the list of available flavors
  const listFlavors = useMemo(
    () => listRegions?.find((r: Region) => r.name === region)?.flavors || [],
    [listRegions, region],
  );

  const engineObject: Engine | undefined = useMemo(
    () => listEngines.find((e) => e.name === engineWithVersion.engine),
    [listEngines, engineWithVersion.engine],
  );
  const versionObject: Version | undefined = useMemo(
    () =>
      engineObject?.versions.find((v) => v.name === engineWithVersion.version),
    [engineObject, engineWithVersion.version],
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

  // find the availability corresponding to selected items
  const availability: database.Availability | undefined = useMemo(
    () =>
      availabilities.find(
        (a) =>
          a.engine === engineWithVersion.engine &&
          a.version === engineWithVersion.version &&
          a.plan === plan &&
          a.region === region &&
          a.specifications.flavor === flavor,
      ),
    [availabilities, engineWithVersion, plan, region, flavor],
  );

  // compute pricing when availability, nbNodes and additionalStorage changes
  useEffect(() => {
    if (!availability) return;
    const offerPricing = flavorObject.pricing;
    const newPrice = {
      hourly: {
        price: offerPricing.hourly.price * nbNodes,
        tax: offerPricing.hourly.tax * nbNodes,
      },
      monthly: {
        price: offerPricing.monthly.price * nbNodes,
        tax: offerPricing.monthly.tax * nbNodes,
      },
    };
    if (flavorObject.storage?.pricing) {
      const storageFactor =
        engineObject.storageMode ===
        database.capabilities.engine.storage.StrategyEnum.distributed
          ? 1
          : nbNodes;
      const { pricing: storagePrices } = flavorObject.storage;
      newPrice.hourly.price +=
        additionalStorage * storagePrices.hourly.price * storageFactor;
      newPrice.hourly.tax +=
        additionalStorage * storagePrices.hourly.tax * storageFactor;
      newPrice.monthly.price +=
        additionalStorage * storagePrices.monthly.price * storageFactor;
      newPrice.monthly.tax +=
        additionalStorage * storagePrices.monthly.tax * storageFactor;
    }

    setPrice(newPrice);
  }, [availability, nbNodes, additionalStorage, engineObject]);

  // select an engine and a version when listEngines is changed
  useEffect(() => {
    const engineAndVersion = { engine: '', version: '' };
    const suggestedEngine = suggestions.find((s) => s.default);
    const defaultEngine =
      listEngines.find((e) => e.name === suggestedEngine.engine) ??
      listEngines[0];
    const { defaultVersion } = defaultEngine;
    engineAndVersion.engine = defaultEngine.name;
    engineAndVersion.version = defaultVersion;
    setEngineWithVersion(engineAndVersion);
  }, [listEngines]);
  // update plan
  useEffect(() => {
    setPlan(
      getSuggestedItemOrDefault(
        suggestions.find((s) => s.engine === engineWithVersion.engine),
        'plan',
        listPlans,
      ),
    );
  }, [listPlans, suggestions, engineWithVersion.engine]);
  // update nodes when plan changes
  useEffect(() => {
    if (!planObject) return;
    setNbNodes(planObject.nodes.minimum);
  }, [plan, listPlans]);
  // update region
  useEffect(() => {
    setRegion(
      getSuggestedItemOrDefault(
        suggestions.find((s) => s.engine === engineWithVersion.engine),
        'region',
        listRegions,
        region,
      ),
    );
  }, [listRegions, suggestions, engineWithVersion.engine, region]);
  // update flavor
  useEffect(() => {
    setFlavor(
      getSuggestedItemOrDefault(
        suggestions.find((s) => s.engine === engineWithVersion.engine),
        'flavor',
        listFlavors,
        flavor,
      ),
    );
  }, [listFlavors, suggestions, engineWithVersion.engine, flavor]);
  // reset storage when flavor is changed
  useEffect(() => {
    setAdditionalStorage(0);
  }, [flavor]);

  return {
    form: {
      engineWithVersion,
      setEngineWithVersion,
      plan,
      setPlan,
      region,
      setRegion,
      flavor,
      setFlavor,
      nbNodes,
      setNbNodes,
      additionalStorage,
      setAdditionalStorage,
    },
    lists: {
      engines: listEngines,
      plans: listPlans,
      regions: listRegions,
      flavors: listFlavors,
    },
    result: {
      availability,
      price,
      engine: engineObject,
      verion: versionObject,
      plan: planObject,
      region: regionObject,
      flavor: flavorObject,
      nodes: nbNodes,
      additionalStorage,
    },
  };
}
