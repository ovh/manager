import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { SavingsPlanConsumption } from '@/types/savingsPlanConsumption.type';

const getSavingsPlanConsumption = async (
  projectId: string,
): Promise<SavingsPlanConsumption> => {
  const response = await fetch(
    // TODO: replace with the correct url  when it will be available
    `https://localhost:8080/uservice/gateway/rating/plans/${projectId}?flavor=b3-8`,
  );
  return response.json();
};

export const useSavingsPlanConsumption = () => {
  const { projectId } = useParams();

  return useQuery({
    queryKey: ['savings-plan-consumption', projectId],
    queryFn: () => getSavingsPlanConsumption(projectId),
    enabled: !!projectId,
  });
};
