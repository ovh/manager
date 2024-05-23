import { useCallback, useEffect, useState } from 'react';
import { TCountry, TInstance, TIpType, TRegion } from '@/api/types';
import { useIpTypes } from '@/api/hooks/useIpTypes';
import { useFloatingRegions } from '@/api/hooks/useFloatingRegions';
import { useCountries } from '@/api/hooks/useCountries';
import { useInstances } from '@/api/hooks/useInstances';

export type TDataState = {
  ipTypes: TIpType[];
  countries: TCountry[];
  instances: {
    all: TInstance[];
    floating: TInstance[];
    additional: TInstance[];
  };
  regions: TRegion[];
};

export const useData = (projectId: string, regionName: string) => {
  const { ipTypes } = useIpTypes();
  const { countries } = useCountries(projectId, regionName);
  const { data: instances } = useInstances(projectId);
  const { floatingRegions: regions } = useFloatingRegions(projectId);

  const [dataState, setDataState] = useState<TDataState>({
    ipTypes: [],
    countries: [],
    instances: {
      all: [],
      floating: [],
      additional: [],
    },
    regions: [],
  });

  useEffect(() => {
    const floatingInstances = (instances || []).filter((instance) =>
      instance.ipAddresses?.some((ip) => ip.type === 'private'),
    );
    const additionalInstances = (instances || []).filter((instance) =>
      instance.ipAddresses.some((ip) => ip.type === 'public'),
    );
    setDataState((prev) => ({
      ...prev,
      ipTypes,
      countries,
      instances: {
        all: instances || [],
        floating: floatingInstances,
        additional: additionalInstances,
      },
      regions,
    }));
  }, [ipTypes, countries, instances, regions]);

  const getInstanceById = useCallback(
    (id: string): TInstance =>
      dataState.instances.all.find((instance) => instance.id === id),
    [dataState.instances],
  );

  return { state: dataState, getInstanceById };
};
