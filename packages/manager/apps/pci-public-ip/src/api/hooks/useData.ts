import { useCallback, useEffect, useState } from 'react';
import { TInstance } from '@ovh-ux/manager-pci-common';
import { TCountry, TRegion } from '@/api/types';
import { useFloatingRegions } from '@/api/hooks/useFloatingRegions';
import { useCountries } from '@/api/hooks/useCountries';
import { useInstances } from '@/api/hooks/useInstances';

export type TDataState = {
  countries: TCountry[];
  instances: {
    all: TInstance[];
    floating: TInstance[];
    additional: TInstance[];
  };
  regions: TRegion[];
};

enum IPType {
  Private = 'private',
  Public = 'public',
}

export const useData = (projectId: string, regionName: string) => {
  const { countries } = useCountries(projectId, regionName);
  const { data: instances, isFetching: isInstanceFetching } = useInstances(
    projectId,
  );
  const { floatingRegions: regions } = useFloatingRegions(projectId);

  const [dataState, setDataState] = useState<TDataState>({
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
      instance.ipAddresses?.some((ip) => ip.type === IPType.Private),
    );
    const additionalInstances = (instances || []).filter((instance) =>
      instance.ipAddresses?.some((ip) => ip.type === IPType.Public),
    );
    setDataState((prev) => ({
      ...prev,
      countries,
      instances: {
        all: instances || [],
        floating: floatingInstances,
        additional: additionalInstances,
      },
      regions,
    }));
  }, [countries, instances, regions]);

  const getInstanceById = useCallback(
    (id: string): TInstance =>
      dataState.instances.all.find((instance) => instance.id === id),
    [dataState.instances],
  );

  return {
    state: dataState,
    getInstanceById,
    isInstanceFetching,
  };
};
