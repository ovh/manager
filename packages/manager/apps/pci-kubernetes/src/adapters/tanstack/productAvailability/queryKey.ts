import { TProductAvailabilityFilter } from '@/api/data/available-regions';

import { queryKey } from '../queryKey';

export const productAvailabilityQueryKey = (
  projectId: string,
  filter: TProductAvailabilityFilter,
) => queryKey(projectId, ['productAvailability', JSON.stringify(filter)]);
