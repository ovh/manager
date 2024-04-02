import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ImportsOptions } from '@/interface';
import { getImportsIPs, moveIPToProject } from '../data/import-ip';
import { paginateResults } from '../utils/pagination';

export const useGetImportsIPs = (
  projectId: string,
  { pagination }: ImportsOptions,
) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['ip', 'type', 'failover'],
    queryFn: () => getImportsIPs(projectId),
  });

  return useMemo(() => {
    return {
      isLoading,
      error,
      data: paginateResults(data || [], pagination),
    };
  }, [data, isLoading, error, pagination]);
};

type MoveIPProps = {
  projectId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useMoveIP = ({ projectId, onError, onSuccess }: MoveIPProps) => {
  const mutation = useMutation({
    mutationFn: (ip: string) => moveIPToProject(ip, projectId),
    onError,
    onSuccess,
  });

  return {
    moveIP: (ip: string) => mutation.mutate(ip),
    ...mutation,
  };
};
