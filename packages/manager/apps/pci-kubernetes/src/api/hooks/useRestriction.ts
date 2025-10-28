import { useEffect, useMemo, useState } from 'react';

import { useMutation } from '@tanstack/react-query';

import { PaginationState } from '@ovh-ux/manager-react-components';

import { paginateResults } from '@/helpers';
import queryClient from '@/queryClient';

import { deleteRestriction, updateRestriction } from '../data/restriction';
import { getClusterRestrictionsQuery, useClusterRestrictions } from './useKubernetes';

export type TMappedRestriction = {
  index: number;
  value: string;
};

export const useMappedRestrictions = (
  projectId: string,
  kubeId: string,
  pagination: PaginationState,
) => {
  const [mappedData, setMappedData] = useState<TMappedRestriction[]>([]);

  const {
    data: restrictions,
    error,
    isLoading,
    isPending,
  } = useClusterRestrictions(projectId, kubeId);

  useEffect(() => {
    if (restrictions) {
      setMappedData(
        restrictions.map((value, index) => ({
          value,
          index,
        })),
      );
    }
  }, [restrictions]);

  const addEmptyRow = () => {
    const emptyRow: TMappedRestriction = {
      value: '',
      index: mappedData.length,
    };
    setMappedData([...mappedData, emptyRow]);
  };

  const deleteRowByIndex = (index: number) => {
    const res = mappedData.filter((md) => md.index !== index);
    setMappedData(res);
  };

  return useMemo(
    () => ({
      isLoading,
      isPending,
      mappedData,
      data: paginateResults<TMappedRestriction>(mappedData || [], pagination),
      error,
      addEmptyRow,
      deleteRowByIndex,
    }),
    [mappedData, pagination, error, isLoading, isPending],
  );
};

type TDeleteRestriction = {
  projectId: string;
  kubeId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useDeleteRestriction = ({
  projectId,
  kubeId,
  onError,
  onSuccess,
}: TDeleteRestriction) => {
  const mutation = useMutation({
    mutationFn: async (ip: string) => deleteRestriction(projectId, kubeId, ip),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getClusterRestrictionsQuery(projectId, kubeId),
      });
      onSuccess();
    },
  });
  return {
    deleteRestriction: (ip: string) => mutation.mutate(ip),
    ...mutation,
  };
};

export const useUpdateRestriction = ({
  projectId,
  kubeId,
  onError,
  onSuccess,
}: TDeleteRestriction) => {
  const mutation = useMutation({
    mutationFn: async (ips: string[]) => updateRestriction(projectId, kubeId, ips),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getClusterRestrictionsQuery(projectId, kubeId),
      });
      onSuccess();
    },
  });
  return {
    updateRestriction: (ips: string[]) => mutation.mutate(ips),
    ...mutation,
  };
};
