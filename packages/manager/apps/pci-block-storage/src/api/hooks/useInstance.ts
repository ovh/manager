import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getInstancesByRegion } from '@/api/data/instance';
import { useVolume } from '@/api/hooks/useVolume';
import { selectAttachableInstances } from '@/api/select/instances';

const getInstancesQueryKey = (projectId: string, region?: string) => [
  'instances',
  projectId,
  region,
];

export const useAttachableInstances = (projectId: string, volumeId: string) => {
  const { data: volume } = useVolume(projectId, volumeId);

  const select = useMemo(
    () =>
      volume ? selectAttachableInstances(volume.availabilityZone) : undefined,
    [volume],
  );

  return useQuery({
    queryKey: getInstancesQueryKey(projectId, volume?.region),
    queryFn: () => getInstancesByRegion(projectId, volume.region),
    enabled: !!volume,
    select,
  });
};
