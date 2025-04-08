import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getDomainCertificate,
  createCertificate,
  createDomainCertificate,
  regenerateDomainCertificate,
  deleteDomainCertificate,
} from '../api/ssl';

export const useGetDomainCertificate = (serviceName: string, domain: string) =>
  useQuery({
    queryKey: [],
    queryFn: () => getDomainCertificate(serviceName, domain),
  });

export const useCreateDomainCertificate = (
  serviceName: string,
  onSuccess: () => void,
  onError: () => void,
) => {
  const mutation = useMutation({
    mutationFn: (domain: string) =>
      createDomainCertificate(serviceName, domain),
    onSuccess,
    onError,
  });

  return {
    createDomainCertificate: mutation.mutate,
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
