import { useQuery } from '@tanstack/react-query';
import { ColumnSort } from '@tanstack/react-table';
import { useMemo } from 'react';
import { getQuotas, Quota } from '@/api/data/quota';
import { useLocations } from '@/api/hooks/useRegions';

export const sortQuotas = (quotas: Quota[], sorting: ColumnSort) => {
  const { id: sortKey, desc } = sorting;

  if (sortKey === 'region') {
    const sortedQuotas = [...quotas].sort((a, b) =>
      a.fullRegionName.localeCompare(b.fullRegionName),
    );

    return desc ? sortedQuotas : sortedQuotas.reverse();
  }
  return quotas;
};

export const useQuotas = (projectId: string) => {
  const query = useQuery({
    queryKey: ['project', projectId, 'quotas'],
    queryFn: () => getQuotas(projectId),
  });

  const { data: locations } = useLocations(projectId);

  const quotas = useMemo(() => {
    return query.data?.map((quota) => {
      const targetLocation = locations.find((location) =>
        location.regions.some((region) => region === quota.region),
      );

      return new Quota({
        ...quota,
        fullRegionName: targetLocation
          ? `${targetLocation?.name} (${quota.region})`
          : quota.region,
      });
    });
  }, [locations, query.data]);

  return {
    ...query,
    quotas,
  };
};
