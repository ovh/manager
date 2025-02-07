import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { SavingsPlanConsumption } from '@/types/savingsPlanConsumption.type';

const getSavingsPlanConsumption = async ({
  flavor,
  projectId,
  year,
  month,
}: {
  projectId?: string;
  flavor?: string;
  year: number;
  month: number;
}): Promise<SavingsPlanConsumption> => {
  const response = await fetch(
    // TODO: replace with the correct url  when it will be available
    `http://localhost:8080/proxy?flavor=${flavor}&projectId=${projectId}&year=${year}&month=${month}`,
    // `http://localhost:8080/proxy?flavor=${flavor}&projectId=${projectId}&year=${year}&month=${month}`,
  );

  return response.json();
};

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
