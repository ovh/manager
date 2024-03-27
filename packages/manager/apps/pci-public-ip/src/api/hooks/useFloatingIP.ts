import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { PaginationState } from '@ovhcloud/manager-components';
import {
  getAllFloatingIP,
  paginateResults,
  terminateFloatingIP,
} from '@/api/data/floating-ip';
import { FloatingIP } from '@/interface';
import queryClient from '@/queryClient';

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

const getQueryKeyFloatingIPs = (projectId: string) => [
  'project',
  projectId,
  'floatingIps',
  'instance',
];

export const useAllFloatingIP = (projectId: string) => {
  return useQuery({
    queryKey: getQueryKeyFloatingIPs(projectId),
    queryFn: () => getAllFloatingIP(projectId),
  });
};

export const useFloatingIP = (projectId: string, ipId: string): FloatingIP => {
  const { data: floatingIPs } = useAllFloatingIP(projectId);
  return floatingIPs.find((floatingIP) => floatingIP.id === ipId) || undefined;
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

type TerminateFloatingIPProps = {
  projectId: string;
  ipId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useTerminateFloatingIP = ({
  projectId,
  ipId,
  onError,
  onSuccess,
}: TerminateFloatingIPProps) => {
  const mutation = useMutation({
    mutationFn: (floatingIp: FloatingIP) => {
      return terminateFloatingIP(projectId, floatingIp.region, floatingIp.id);
    },
    onError,
    onSuccess: () => {
      queryClient.setQueryData(
        getQueryKeyFloatingIPs(projectId),
        (queryClient.getQueryData(getQueryKeyFloatingIPs(projectId)) as Array<
          FloatingIP
        >).filter((floatingIp) => `${floatingIp.id}` !== ipId),
      );
      return onSuccess();
    },
  });

  return {
    terminate: (floatingIP: FloatingIP) => {
      return mutation.mutate(floatingIP);
    },
    ...mutation,
  };
};
