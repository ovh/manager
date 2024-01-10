import { useEffect, useState, useMemo } from 'react';
import { database } from '@/models/database';
import { Engine, Plan, Region, Version } from '@/models/dto/OrderFunnel';
import { createTree } from '@/lib/availabilities';

export function useAvailabilities(
  availabilities: database.Availability[],
  capabilities: database.Capabilities,
) {
  const [engine, setEngine] = useState({ engine: '', version: '' });
  const [plan, setPlan] = useState('');
  const [region, setRegion] = useState('');
  const [flavor, setFlavor] = useState('');

  const listEngines = useMemo(() => createTree(availabilities, capabilities), [
    availabilities,
    capabilities,
  ]);
  const listPlans = useMemo(
    () =>
      listEngines
        ?.find((e: Engine) => e.name === engine.engine)
        ?.versions.find((v: Version) => v.name === engine.version)?.plans,
    [listEngines, engine.engine, engine.version],
  );
  const listRegions = useMemo(
    () => listPlans?.find((p: Plan) => p.name === plan)?.regions,
    [listPlans, plan],
  );
  const listFlavors = useMemo(
    () => listRegions?.find((r: Region) => r.name === region)?.flavors,
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
          a.flavor === flavor,
      ),
    [availabilities, engine, plan, region, flavor],
  );

  useEffect(() => {
    const e = { engine: '', version: '' };
    const defaultEngine = listEngines[0];
    const defaultVersion = defaultEngine.versions[0].name;
    e.engine = listEngines[0].name;
    e.version = defaultVersion;
    setEngine(e);
  }, [listEngines]);

  useEffect(() => {
    if (listPlans) {
      setPlan(listPlans[0].name || '');
    } else {
      setPlan('');
    }
  }, [listPlans]);

  useEffect(() => {
    if (listRegions) {
      setRegion(listRegions[0].name || '');
    } else {
      setRegion('');
    }
  }, [listRegions]);

  useEffect(() => {
    if (listFlavors) {
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
