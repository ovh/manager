import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { useState } from 'react';
import {
  deleteRancherService,
  deleteRancherServiceQueryKey,
  getByRancherIdProjectId,
  getRancherProjectById,
  getRancherVersionCapabilities,
} from '@/api';
import { ErrorResponse, RancherService, RancherVersion } from '@/api/api.type';

export const useRancher = ({
  refetchInterval,
}: {
  refetchInterval?: number;
} = {}) => {
  const { projectId, rancherId } = useParams();
  return useQuery<RancherService, ErrorResponse>({
    queryKey: ['project', projectId, 'rancher', rancherId],
    queryFn: () => getByRancherIdProjectId(projectId, rancherId),
    refetchInterval: refetchInterval ?? false,
  });
};

export const ranchersQueryKey = (projectId: string) => ['project', projectId];

export const useRanchers = ({
  shouldDisableRefetch = false,
}: {
  shouldDisableRefetch?: boolean;
}) => {
  const { projectId } = useParams();
  return useQuery<RancherService[], ErrorResponse>({
    queryKey: ranchersQueryKey(projectId),
    queryFn: () => getRancherProjectById(projectId),
    refetchInterval: shouldDisableRefetch ? false : 5000,
  });
};

export const useDeleteRancher = () => {
  const { refetch } = useRanchers({ shouldDisableRefetch: true });
  const { data: rancher } = useRancher();
  const [
    deleteRancherResponse,
    setDeleteRancherResponse,
  ] = useState<ODS_MESSAGE_TYPE.error | null>(null);

  const { projectId } = useParams();

  const { mutate: deleteRancher } = useMutation({
    mutationFn: () =>
      deleteRancherService({
        rancherId: rancher?.id,
        projectId,
      }),
    mutationKey: deleteRancherServiceQueryKey(rancher?.id),
    onSuccess: () => refetch(),
  });

  return {
    deleteRancher,
    setDeleteRancherResponse,
    deleteRancherResponse,
  };
};

export const useRancherVersionsCapabilities = () => {
  const { projectId, rancherId } = useParams();
  return useQuery<RancherVersion[], ErrorResponse>({
    queryKey: [
      'project',
      projectId,
      'rancher',
      rancherId,
      'version',
      'capabilities',
    ],
    queryFn: () => getRancherVersionCapabilities(projectId, rancherId),
  });
};
