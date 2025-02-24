import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { SavingsPlanConsumption } from '@/types/savingsPlanConsumption.type';
import {
  EMPTY_MOCK,
  MOCK_FEV_2025,
  MOCK_JAN_2025,
} from './mockPlanConsumption';

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
  console.log('getSavingsPlanConsumption', flavor, projectId, year, month);

  if (month === 2 && year === 2025) {
    return MOCK_FEV_2025;
  }

  if (month === 1 && year === 2025) {
    return MOCK_JAN_2025;
  }

  return EMPTY_MOCK;
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
