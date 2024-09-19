import { v6 } from '@ovh-ux/manager-core-api';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useServices } from './useService';
import {
  SavingsPlanPlanedChangeStatus,
  SavingsPlanService,
} from '@/types/api.type';
import { getSavingsPlansUrl } from '@/utils/routes';

export const getSubscribedSavingsPlan = async (
  serviceId: number,
): Promise<SavingsPlanService[]> => {
  const { data } = await v6.get<SavingsPlanService[]>(
    `services/${serviceId}/savingsPlans/subscribed`,
  );
  return data;
};

export const postSubscribedSavingsPlanChangePeriod = async (
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

export const putSubscribedSavingsPlanEditName = async (
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

export const postSavingsPlan = async ({
  serviceId,
  offerId,
  displayName,
  size,
}: {
  serviceId: number;
  offerId: string;
  displayName: string;
  size: number;
}): Promise<SavingsPlanService[]> => {
  const { data } = await v6.post<SavingsPlanService[]>(
    `/services/${serviceId}/savingsPlans/subscribe/execute`,
    {
      displayName,
      offerId,
      size,
    },
  );
  return data;
};

export const useServiceId = () => {
  const { projectId } = useParams();
  const { data: services } = useServices({
    projectId: projectId as string,
  });
  return services?.[0];
};

export const useSavingsPlan = () => {
  const serviceId = useServiceId();

  return useQuery({
    queryKey: ['savings-plan', serviceId],
    queryFn: () => getSubscribedSavingsPlan(serviceId),
    enabled: !!serviceId,
  });
};

export const getMutationKeySPChangePeriod = (
  savingsPlanId: string,
  serviceId: number,
) => ['savings-plan', serviceId, 'change-period', savingsPlanId];

export const useSavingsPlanChangePeriod = (savingsPlanId: string) => {
  const { refetch } = useSavingsPlan();
  const serviceId = useServiceId();

  return useMutation({
    onSuccess: () => refetch(),
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

export const getMutationKeySPEditName = (
  savingsPlanId: string,
  serviceId: number,
) => ['savings-plan', serviceId, 'edit-name', savingsPlanId];

export const getMutationKeyCreateSavingsPlan = (serviceId: number) => [
  'savings-plan',
  serviceId,
  'create',
];

export const useSavingsPlanEditName = (savingsPlanId: string) => {
  const { refetch } = useSavingsPlan();
  const serviceId = useServiceId();

  return useMutation({
    onSuccess: () => refetch(),
    mutationKey: getMutationKeySPEditName(savingsPlanId, serviceId),
    mutationFn: ({ displayName }: { displayName: string }) =>
      putSubscribedSavingsPlanEditName(serviceId, savingsPlanId, displayName),
  });
};

export const useSavingsPlanCreate = () => {
  const { refetch } = useSavingsPlan();
  const serviceId = useServiceId();
  const navigate = useNavigate();
  const { projectId } = useParams();

  return useMutation({
    onSuccess: async () => {
      const { data } = await refetch();
      if (data?.length) {
        navigate(getSavingsPlansUrl(projectId));
      }
    },
    mutationKey: getMutationKeyCreateSavingsPlan(serviceId),
    mutationFn: ({
      displayName,
      offerId,
      size,
    }: {
      displayName: string;
      offerId: string;
      size: number;
    }) => postSavingsPlan({ serviceId, offerId, displayName, size }),
  });
};
