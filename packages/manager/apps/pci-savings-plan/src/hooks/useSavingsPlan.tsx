import { v6 } from '@ovh-ux/manager-core-api';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  UseSavingsPlanParams,
  SavingsPlanContract,
  SavingsPlanPlanedChangeStatus,
  SavingsPlanService,
} from '@/types/api.type';
import { getSavingsPlansListingUrl } from '@/utils/routes';
import { useParam, useProjectId } from './useProject';
import { toIsoDate } from '@/utils/formatter/date';

const getSubscribedSavingsPlan = async (
  serviceId: number,
): Promise<SavingsPlanService[]> => {
  const { data } = await v6.get<SavingsPlanService[]>(
    `services/${serviceId}/savingsPlans/subscribed`,
  );
  return data;
};

const postSubscribedSavingsPlanChangePeriod = async (
  serviceId: number,
  savingsPlanId: string,
  periodEndAction: SavingsPlanPlanedChangeStatus,
): Promise<SavingsPlanService[]> => {
  const { data } = await v6.post<SavingsPlanService[]>(
    `/services/${serviceId}/savingsPlans/subscribed/${savingsPlanId}/changePeriodEndAction`,
    {
      periodEndAction,
    },
  );
  return data;
};

const putSubscribedSavingsPlanEditName = async (
  serviceId: number,
  savingsPlanId: string,
  displayName: string,
): Promise<SavingsPlanService[]> => {
  const { data } = await v6.put<SavingsPlanService[]>(
    `/services/${serviceId}/savingsPlans/subscribed/${savingsPlanId}`,
    {
      displayName,
    },
  );
  return data;
};

const getSavingsPlanContracts = async (
  serviceId: number,
): Promise<SavingsPlanContract[]> => {
  const { data } = await v6.get<SavingsPlanContract[]>(
    `/services/${serviceId}/savingsPlans/contracts`,
  );
  return data;
};

const postSavingsPlan = async ({
  serviceId,
  offerId,
  displayName,
  size,
  startDate,
}: {
  serviceId: number;
  offerId: string;
  displayName: string;
  size: number;
  startDate: string;
}): Promise<SavingsPlanService> => {
  const { data } = await v6.post<SavingsPlanService>(
    `/services/${serviceId}/savingsPlans/subscribe/execute`,
    {
      displayName,
      offerId,
      size,
      startDate,
    },
  );
  return data;
};

export const useServiceId = (): number => {
  const { serviceId } = useRouteLoaderData('savings-plan') as {
    serviceId: number;
  };

  return serviceId;
};

export const useSavingsPlan = () => {
  const serviceId = useServiceId();

  return useQuery({
    queryKey: ['savings-plan', serviceId],
    queryFn: () => getSubscribedSavingsPlan(serviceId),
    enabled: !!serviceId,
  });
};

const getMutationKeySPChangePeriod = (
  savingsPlanId: string,
  serviceId: number,
) => ['savings-plan', serviceId, 'change-period', savingsPlanId];

export const useSavingsPlanChangePeriod = ({
  savingsPlanId,
  onSuccess,
}: UseSavingsPlanParams) => {
  const { refetch } = useSavingsPlan();
  const serviceId = useServiceId();

  return useMutation({
    onSuccess: async () => {
      onSuccess?.();
      refetch();
    },
    mutationKey: getMutationKeySPChangePeriod(savingsPlanId, serviceId),
    mutationFn: ({
      periodEndAction,
    }: {
      periodEndAction: SavingsPlanPlanedChangeStatus;
    }) =>
      postSubscribedSavingsPlanChangePeriod(
        serviceId,
        savingsPlanId,
        periodEndAction,
      ),
  });
};

const getMutationKeySPEditName = (savingsPlanId: string, serviceId: number) => [
  'savings-plan',
  serviceId,
  'edit-name',
  savingsPlanId,
];

export const getMutationKeyCreateSavingsPlan = (serviceId: number) => [
  'savings-plan',
  serviceId,
  'create',
];

export const useSavingsPlanEditName = ({
  savingsPlanId,
  onSuccess,
}: UseSavingsPlanParams) => {
  const { refetch } = useSavingsPlan();
  const serviceId = useServiceId();

  return useMutation({
    mutationKey: getMutationKeySPEditName(savingsPlanId, serviceId),
    mutationFn: ({ displayName }: { displayName: string }) =>
      putSubscribedSavingsPlanEditName(serviceId, savingsPlanId, displayName),
    onSuccess: async () => {
      onSuccess?.();
      refetch();
    },
  });
};

type MutationCreatePlanParams = {
  displayName: string;
  offerId: string;
  size: number;
  startDate: Date;
};

export const useSavingsPlanCreate = (
  onSuccess?: (data: SavingsPlanService) => void,
) => {
  const { refetch } = useSavingsPlan();
  const serviceId = useServiceId();
  const navigate = useNavigate();
  const projectId = useProjectId();

  return useMutation({
    onSuccess: async (res) => {
      const { data: refetchData } = await refetch();
      if (refetchData?.length && onSuccess) {
        const foundPlan = refetchData?.find((data) => data.id === res.id);
        if (foundPlan) {
          onSuccess(foundPlan);
        }
        navigate(getSavingsPlansListingUrl(projectId));
      }
    },
    mutationKey: getMutationKeyCreateSavingsPlan(serviceId),
    mutationFn: ({
      displayName,
      offerId,
      size,
      startDate,
    }: MutationCreatePlanParams) => {
      const date = toIsoDate(startDate);

      return postSavingsPlan({
        serviceId,
        offerId,
        displayName,
        size,
        startDate: date,
      });
    },
  });
};

export const useSavingsPlanContract = () => {
  const serviceId = useServiceId();

  return useQuery({
    queryKey: ['contracts', serviceId],
    queryFn: () => getSavingsPlanContracts(serviceId),
  });
};

export const useSavingsPlanId = (): string => useParam('savingsPlanId');
