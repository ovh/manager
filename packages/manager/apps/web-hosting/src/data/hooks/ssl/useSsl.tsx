import { useMutation } from '@tanstack/react-query';
import { createCertificate } from '../../api/ssl';

export const useCreateCertificate = (
  serviceName: string,
  onSuccess: () => void,
  onError: () => void,
) => {
  const mutation = useMutation({
    mutationFn: ({
      certificate,
      key,
      chain,
    }: {
      certificate?: string;
      key?: string;
      chain?: string;
    }) => createCertificate(serviceName, certificate, key, chain),
    onSuccess,
    onError,
  });

  return {
    createCertificate: mutation.mutate,
    ...mutation,
  };
};
