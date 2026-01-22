import { queryKey } from '../queryKey';

type TProductAvailabilityFilter = {
  addonFamily: string;
  ovhSubsidiary: string;
};

export const productAvailabilityQueryKey = (
  projectId: string,
  filter: TProductAvailabilityFilter,
) => queryKey(projectId, ['productAvailability', JSON.stringify(filter)]);
