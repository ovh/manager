import { useEffect, useState, useMemo } from 'react';
import { database } from '@/models/database';
import { Engine, Flavor, Plan, Region, Version } from '@/models/order-funnel';
import { order } from '@/models/catalog';
import { createTree } from '@/lib/availabilitiesHelper';
// import { createTree } from '@/lib/availabilities';
export interface AvailabilitiesHookOutput {
  engine: { engine: string; version: string };
  setEngine: React.Dispatch<
    React.SetStateAction<{ engine: string; version: string }>
  >;

  plan: string;
  setPlan: React.Dispatch<React.SetStateAction<string>>;

  region: string;
  setRegion: React.Dispatch<React.SetStateAction<string>>;

  flavor: string;
  setFlavor: React.Dispatch<React.SetStateAction<string>>;

  availability?: database.Availability;

  listEngines: Engine[];
  listPlans: Plan[];
  listRegions: Region[];
  listFlavors: Flavor[];
}

export function useAvailabilities(
  availabilities: database.Availability[],
  capabilities: database.Capabilities,
  engineCapabilities: database.EngineCapabilities[],
  regionCapabilities: database.RegionCapabilities[],
  suggestions: database.Suggestion[],
  catalog: order.publicOrder.Catalog,
): AvailabilitiesHookOutput {
  const [engine, setEngine] = useState({ engine: '', version: '' });
  const [plan, setPlan] = useState('');
  const [region, setRegion] = useState('');
  const [flavor, setFlavor] = useState('');

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
  const listPlans = useMemo(
    () =>
      listEngines
        ?.find((e: Engine) => e.name === engine.engine)
        ?.versions.find((v: Version) => v.name === engine.version)?.plans || [],
    [listEngines, engine.engine, engine.version],
  );
  const listRegions = useMemo(
    () => listPlans?.find((p: Plan) => p.name === plan)?.regions || [],
    [listPlans, plan],
  );
  const listFlavors = useMemo(
    () => listRegions?.find((r: Region) => r.name === region)?.flavors || [],
    [listRegions, region],
  );

  const availability = useMemo(
    () =>
      availabilities.find(
        (a) =>
          a.engine === engine.engine &&
          a.version === engine.version &&
          a.plan === plan &&
          a.region === region &&
          a.specifications.flavor === flavor,
      ),
    [availabilities, engine, plan, region, flavor],
  );

  useEffect(() => {
    const engineAndVersion = { engine: '', version: '' };
    const suggestedEngine = suggestions.find((s) => s.default);
    const defaultEngine = listEngines.find(
      (e) => e.name === suggestedEngine.engine,
    );
    const { defaultVersion } = defaultEngine;
    engineAndVersion.engine = defaultEngine.name;
    engineAndVersion.version = defaultVersion;
    setEngine(engineAndVersion);
  }, [listEngines]);

  useEffect(() => {
    if (listPlans.length > 0) {
      setPlan(listPlans[0].name || '');
    } else {
      setPlan('');
    }
  }, [listPlans]);

  useEffect(() => {
    if (listRegions.length > 0) {
      setRegion(listRegions[0].name || '');
    } else {
      setRegion('');
    }
  }, [listRegions]);

  useEffect(() => {
    if (listFlavors.length > 0) {
      setFlavor(listFlavors[0].name || '');
    } else {
      setFlavor('');
    }
  }, [listFlavors]);

  return {
    engine,
    setEngine,
    plan,
    setPlan,
    region,
    setRegion,
    flavor,
    setFlavor,
    availability,
    listEngines,
    listPlans,
    listRegions,
    listFlavors,
  };
}
