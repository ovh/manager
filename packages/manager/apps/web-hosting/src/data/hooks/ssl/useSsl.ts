import { useEffect } from 'react';

import { useInfiniteQuery, useMutation } from '@tanstack/react-query';

import { ApiError, IcebergFetchResultV2 } from '@ovh-ux/manager-core-api';

import {
  createCertificate,
  createDomainCertificate,
  createDomainCertificates,
  deleteDomainCertificate,
} from '../../api/ssl';
import {
  getResourceAttachedDomains,
  getResourceAttachedDomainsQueryKey,
} from '../../api/webHosting';
import { WebsiteType } from '../../types/product/website';

export const useResourceAttachedDomains = (serviceName: string) => {
  const query = useInfiniteQuery({
    queryKey: getResourceAttachedDomainsQueryKey(serviceName),
    queryFn: ({ pageParam }) => getResourceAttachedDomains({ serviceName, pageParam: pageParam }),
    enabled: !!serviceName,
    initialPageParam: null,
    getNextPageParam: (lastPage: IcebergFetchResultV2<WebsiteType>) => lastPage.cursorNext ?? null,
  });

  const { hasNextPage, isFetchingNextPage, fetchNextPage, dataUpdatedAt } = query;

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage().catch(console.error);
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, dataUpdatedAt]);

  const flattenData: WebsiteType[] =
    query.data?.pages.flatMap((page: IcebergFetchResultV2<WebsiteType>) => page.data ?? []) ?? [];

  return Object.assign(query, { flattenData });
};

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
