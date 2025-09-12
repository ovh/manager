import { useMutation } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import {
  createCertificate,
  createDomainCertificate,
  createDomainCertificates,
  deleteDomainCertificate,
} from '../../api/ssl';

export const useCreateCertificate = (
  serviceName: string,
  onSuccess: () => void,
  onError: (error: ApiError) => void,
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
  onError: (error: ApiError) => void,
) => {
  const mutation = useMutation({
    mutationFn: (domain: string) => createDomainCertificate(serviceName, domain),
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
  onError: (error: ApiError) => void,
) => {
  const mutation = useMutation({
    mutationFn: (domains: string[]) => createDomainCertificates(serviceName, domains),
    onSuccess,
    onError,
  });

  return {
    createDomainCertificates: mutation.mutate,
    ...mutation,
  };
};

export const useDeleteDomainCertificate = (
  serviceName: string,
  onSuccess: () => void,
  onError: (error: ApiError) => void,
) => {
  const mutation = useMutation({
    mutationFn: (domain: string) => deleteDomainCertificate(serviceName, domain),
    onSuccess,
    onError,
  });

  return {
    deleteDomainCertificate: mutation.mutate,
    ...mutation,
  };
};
