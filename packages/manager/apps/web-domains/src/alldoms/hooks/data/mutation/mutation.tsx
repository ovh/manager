import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateAllDomService,
  updateDomainServiceInfo,
} from '@/alldoms/data/api/web-domains';

export const useUpdateAllDomService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAllDomService,
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
