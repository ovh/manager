import { OvhSubsidiaryEnum } from '@datatr-ux/ovhcloud-types/nichandle/index';
import { useUser } from '@/hooks/useUser';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/useImmediateRefetch';
import { getProductAvailability } from '@/data/api/availability/availability.api';

export function useGetProductAvailability(
  projectId: string,
  options?: OptionsFor<typeof getProductAvailability>,
) {
  const user = useUser();
  const ovhSubsidiary =
    (user?.ovhSubsidiary as OvhSubsidiaryEnum) ?? OvhSubsidiaryEnum.FR;
  const queryKey = [
    projectId,
    'capabilities/productAvailability',
    ovhSubsidiary,
  ];
  return useQueryImmediateRefetch({
    queryKey,
    enabled: !!user?.ovhSubsidiary,
    queryFn: () => getProductAvailability({ projectId, ovhSubsidiary }),
    ...options,
  });
}
