import { useEffect, useState, useMemo } from 'react';
import { database } from '@/models/database';

export function useAvailabilities(availabilities: database.Availability[]) {
  const [engine, setEngine] = useState('');
  const [version, setVersion] = useState('');
  const [plan, setPlan] = useState('');
  const [region, setRegion] = useState('');
  const [flavor, setFlavor] = useState('');

  const listEngines = useMemo(
    () => [...new Set(availabilities.map((a) => a.engine))],
    [availabilities],
  );
  const listVersions = useMemo(
    () => [
      ...new Set(
        availabilities.filter((a) => a.engine === engine).map((a) => a.version),
      ),
    ],
    [availabilities, engine],
  );
  const listPlans = useMemo(
    () => [
      ...new Set(
        availabilities
          .filter((a) => a.engine === engine && a.version === version)
          .map((a) => a.plan),
      ),
    ],
    [availabilities, engine, version],
  );
  const listRegions = useMemo(
    () => [
      ...new Set(
        availabilities
          .filter(
            (a) =>
              a.engine === engine && a.version === version && a.plan === plan,
          )
          .map((a) => a.region),
      ),
    ],
    [availabilities, engine, version, plan],
  );
  const listFlavors = useMemo(
    () => [
      ...new Set(
        availabilities
          .filter(
            (a) =>
              a.engine === engine &&
              a.version === version &&
              a.plan === plan &&
              a.region === region,
          )
          .map((a) => a.flavor),
      ),
    ],
    [availabilities, engine, version, plan, region],
  );

  const availability = useMemo(
    () =>
      availabilities.find(
        (a) =>
          a.engine === engine &&
          a.version === version &&
          a.plan === plan &&
          a.region === region,
      ),
    [availabilities, engine, version, plan, region],
  );

  useEffect(() => {
    setEngine(listEngines[0] || '');
  }, [listEngines]);

  useEffect(() => {
    setVersion(listVersions[0] || '');
  }, [listVersions]);

  useEffect(() => {
    setPlan(listPlans[0] || '');
  }, [listPlans]);

  useEffect(() => {
    setRegion(listRegions[0] || '');
  }, [listRegions]);

  useEffect(() => {
    setFlavor(listFlavors[0] || '');
  }, [listFlavors]);

  return {
    engine,
    setEngine,
    version,
    setVersion,
    plan,
    setPlan,
    region,
    setRegion,
    flavor,
    setFlavor,
    availability,
    listEngines,
    listVersions,
    listPlans,
    listRegions,
    listFlavors,
  };
}
