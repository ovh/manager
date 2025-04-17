import { useMutation } from '@tanstack/react-query';
import {
  createCertificate,
  createDomainCertificate,
  createDomainCertificates,
} from '../../api/ssl';

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

export const useCreateDomainCertificates = (
  serviceName: string,
  onSuccess: () => void,
  onError: () => void,
) => {
  const mutation = useMutation({
    mutationFn: (domains: string[]) =>
      createDomainCertificates(serviceName, domains),
    onSuccess,
    onError,
  });

  return {
    createDomainCertificates: mutation.mutate,
    ...mutation,
  };
};
