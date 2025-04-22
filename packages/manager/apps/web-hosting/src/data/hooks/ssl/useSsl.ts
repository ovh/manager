import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  deleteDomainCertificate,
  regenerateDomainCertificate,
} from '@/data//api/ssl';

export const useDeleteDomainCertificate = (
  serviceName: string,
  onSuccess: () => void,
  onError: (error: ApiError) => void,
) => {
  const mutation = useMutation({
    mutationFn: (domain: string) =>
      deleteDomainCertificate(serviceName, domain),
    onSuccess,
    onError,
  });

  return {
    deleteDomainCertificate: mutation.mutate,
    ...mutation,
  };
};

export const useRegenerateDomainCertificate = (
  serviceName: string,
  onSuccess: () => void,
  onError: () => void,
) => {
  const mutation = useMutation({
    mutationFn: (domain: string) =>
      regenerateDomainCertificate(serviceName, domain),
    onSuccess,
    onError,
  });

  return {
    regenerateDomainCertificate: mutation.mutate,
    ...mutation,
  };
};
