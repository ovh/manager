import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getSavingsPlanConsumption } from '@/data/api/pci-savings-plan';

export const useSavingsPlanConsumption = ({
  flavor,
  year,
  month,
}: {
  flavor?: string;
  year: number;
  month: number;
}) => {
  const { projectId } = useParams();
  return useQuery({
    queryKey: ['savings-plan-consumption', projectId, year, month, flavor],
    queryFn: () =>
      getSavingsPlanConsumption({ projectId, year, month, flavor }),
    enabled: !!projectId,
  });
};
