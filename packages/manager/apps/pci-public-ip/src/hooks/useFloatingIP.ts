import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { PaginationState } from '@ovhcloud/manager-components';
import { getAllFloatingIP, paginateResults } from '@/data/floating-ip';

export interface ResponseAPIError {
  message: string;
  stack: string;
  name: string;
  code: string;
  response?: {
    headers?: {
      [key: string]: string;
      'x-ovh-queryid': string;
    };
    data?: {
      message?: string;
    };
  };
}

export type FloatingIPOptions = {
  pagination: PaginationState;
};

export const useAllFloatingIP = (projectId: string) => {
  return useQuery({
    queryKey: ['project', projectId, 'floatingIps', 'instance'],
    queryFn: () => getAllFloatingIP(projectId),
  });
};

export const useFLoatingIPs = (
  projectId: string,
  { pagination }: FloatingIPOptions,
) => {
  const { data, error, isLoading } = useAllFloatingIP(projectId);

  return useMemo(() => {
    return {
      isLoading,
      error,
      data: paginateResults(data || [], pagination),
    };
  }, [data, pagination]);
};
