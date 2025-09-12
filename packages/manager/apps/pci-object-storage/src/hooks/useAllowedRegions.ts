import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  useProductAvailability,
  useGetProjectRegions,
} from '@ovh-ux/manager-pci-common';
import {
  filterAllowedRegions,
  RegionFilterCriteria,
} from '@/domain/regions/regionFilter';

export function useAllowedRegions(criteria: RegionFilterCriteria = {}) {
  const { projectId } = useParams();

  const {
    data: availability,
    isPending: isAvailabilityPending,
  } = useProductAvailability(projectId);

  const {
    data: projectRegions,
    isPending: isProjectRegionsPending,
  } = useGetProjectRegions(projectId);

  const isPending = isAvailabilityPending || isProjectRegionsPending;

  const allowedRegions = useMemo(() => {
    if (isPending) return [];
    return filterAllowedRegions(availability, projectRegions, criteria);
  }, [availability, projectRegions, criteria, isPending]);

  return {
    allowedRegions,
    isPending,
    hasRegions: allowedRegions.length > 0,
  };
}
