import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateAllDomService,
  updateDomainServiceInfo,
} from '@/alldoms/data/api/web-domains';
import { ServiceInfoUpdateEnum } from '@/alldoms/enum/service.enum';

export const useTerminateAllDomService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (serviceName: string) =>
      updateAllDomService(
        serviceName,
        ServiceInfoUpdateEnum.TerminateAtExpirationDate,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alldom'] });
    },
  });
};

export const useUpdateDomainServiceInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (domainName: string) => updateDomainServiceInfo(domainName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alldom'] });
    },
  });
};
