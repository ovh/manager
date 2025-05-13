import { useMutation } from '@tanstack/react-query';
import { deleteDomainCertificate } from '@/data//api/ssl';

export const useDeleteDomainCertificate = (
  serviceName: string,
  onSuccess: () => void,
  onError: () => void,
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
