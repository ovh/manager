import { useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { PaginationState } from '@ovh-ux/manager-react-components';
import {
  attachBasicIp,
  detachBasicIp,
  getAllBasicIp,
  terminateBasicIp,
  TBasicIp,
} from '@/api/data/basic-ip';
import { paginateResults } from '@/api/utils/pagination';
import { TBasicIpRow } from '@/types/publicip.type';
import { TerminateIPProps } from '@/interface';
import queryClient from '@/queryClient';

export const getQueryKeyBasicIps = (projectId: string) => [
  'project',
  projectId,
  'extNetPublicIps',
];

const toBasicIpRow = (basicIp: TBasicIp): TBasicIpRow => {
  const region =
    basicIp.currentState?.location?.region ??
    basicIp.targetSpec?.location?.region ??
    '';
  const associatedResourceId =
    basicIp.currentState?.associatedResource?.id ?? '';

  return {
    id: basicIp.id,
    ip: basicIp.currentState?.ip ?? basicIp.id,
    region,
    associatedResourceId,
    isAttached: !!associatedResourceId,
    status: basicIp.resourceStatus,
    search: `${basicIp.id} ${region} ${associatedResourceId}`,
  };
};

export const useAllBasicIp = (projectId: string, enabled = true) =>
  useQuery({
    queryKey: getQueryKeyBasicIps(projectId),
    queryFn: () => getAllBasicIp(projectId),
    select: (publicIps) => publicIps.map(toBasicIpRow),
    enabled,
  });

export const useBasicIps = (
  projectId: string,
  { pagination }: { pagination: PaginationState },
  filters: Filter[] = [],
) => {
  const { data: publicIps, error, isLoading } = useAllBasicIp(projectId);

  return useMemo(
    () => ({
      isLoading,
      error,
      data: paginateResults(applyFilters(publicIps || [], filters), pagination),
    }),
    [publicIps, error, isLoading, pagination, filters],
  );
};

export const useTerminateBasicIp = ({
  projectId,
  onError,
  onSuccess,
}: TerminateIPProps) => {
  const mutation = useMutation({
    mutationFn: (basicIp: TBasicIpRow) =>
      terminateBasicIp(projectId, basicIp.id),
    onError,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getQueryKeyBasicIps(projectId),
      });
      return onSuccess();
    },
  });

  return {
    terminate: (basicIp: TBasicIpRow) => mutation.mutate(basicIp),
    ...mutation,
  };
};

export const useAttachBasicIp = ({
  projectId,
  onError,
  onSuccess,
}: TerminateIPProps) => {
  const mutation = useMutation({
    mutationFn: ({
      basicIp,
      instanceId,
    }: {
      basicIp: TBasicIpRow;
      instanceId: string;
    }) =>
      attachBasicIp({
        projectId,
        regionName: basicIp.region,
        ip: basicIp.ip,
        instanceId,
      }),
    onError,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getQueryKeyBasicIps(projectId),
      });
      return onSuccess();
    },
  });

  return {
    attach: (basicIp: TBasicIpRow, instanceId: string) =>
      mutation.mutate({ basicIp, instanceId }),
    ...mutation,
  };
};

export const useDetachBasicIp = ({
  projectId,
  onError,
  onSuccess,
}: TerminateIPProps) => {
  const mutation = useMutation({
    mutationFn: (basicIp: TBasicIpRow) =>
      detachBasicIp({
        projectId,
        regionName: basicIp.region,
        ip: basicIp.ip,
      }),
    onError,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getQueryKeyBasicIps(projectId),
      });
      return onSuccess();
    },
  });

  return {
    detach: (basicIp: TBasicIpRow) => mutation.mutate(basicIp),
    ...mutation,
  };
};

export type TBasicIpTerminationOutcome = {
  deleted: string[];
  failed: string[];
};

export const useTerminateBasicIps = ({
  projectId,
  onSettled,
}: {
  projectId: string;
  onSettled: (outcome: TBasicIpTerminationOutcome) => void;
}) => {
  const mutation = useMutation({
    mutationFn: async (ipIds: string[]) => {
      // one failing deletion must not cancel the others
      const outcomes = await Promise.allSettled(
        ipIds.map((id) => terminateBasicIp(projectId, id)),
      );

      return ipIds.reduce<TBasicIpTerminationOutcome>(
        (outcome, id, index) => {
          const terminated = outcomes[index].status === 'fulfilled';
          return terminated
            ? { ...outcome, deleted: [...outcome.deleted, id] }
            : { ...outcome, failed: [...outcome.failed, id] };
        },
        { deleted: [], failed: [] },
      );
    },
    onSuccess: (outcome) => {
      queryClient.invalidateQueries({
        queryKey: getQueryKeyBasicIps(projectId),
      });
      return onSettled(outcome);
    },
  });

  return {
    terminate: (ipIds: string[]) => mutation.mutate(ipIds),
    ...mutation,
  };
};
