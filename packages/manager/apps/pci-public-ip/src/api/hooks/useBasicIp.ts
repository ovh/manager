import { useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { PaginationState } from '@ovh-ux/manager-react-components';
import { TInstance } from '@ovh-ux/manager-pci-common';
import {
  attachBasicIp,
  detachBasicIp,
  getAllBasicIp,
  terminateBasicIp,
  TBasicIp,
} from '@/api/data/basic-ip';
import {
  getProjectGatewayName,
  TProjectGateway,
} from '@/api/data/project-gateways';
import { paginateResults } from '@/api/utils/pagination';
import {
  BASIC_IP_RESOURCE_TYPE,
  TBasicIpRow,
  TIpVersion,
} from '@/types/publicip.type';
import { TerminateIPProps } from '@/interface';
import queryClient from '@/queryClient';
import { useInstances } from './useInstances';
import { useProjectGateways } from './useProjectGateways';

export const getQueryKeyBasicIps = (projectId: string) => [
  'project',
  projectId,
  'extNetPublicIps',
];

/**
 * Reads the version the api reports, whether it sends it as a number or spells it
 * out, and derives it from the address itself when it reports none.
 */
const toIpVersion = (
  ip: string,
  ipVersion: number | string | undefined,
): TIpVersion => {
  if (ipVersion !== undefined && ipVersion !== null) {
    return String(ipVersion).includes('6') ? 6 : 4;
  }

  return ip.includes(':') ? 6 : 4;
};

const toBasicIpRow = (basicIp: TBasicIp): TBasicIpRow => {
  const region =
    basicIp.currentState?.location?.region ??
    basicIp.targetSpec?.location?.region ??
    '';
  const associatedResource = basicIp.currentState?.associatedResource;
  const associatedResourceId = associatedResource?.id ?? '';
  const ip = basicIp.currentState?.ip ?? basicIp.id;
  const ipVersion = toIpVersion(ip, basicIp.currentState?.ipVersion);

  return {
    id: basicIp.id,
    ip,
    ipVersion,
    region,
    associatedResourceId,
    associatedResourceType: associatedResource?.type?.toLowerCase() ?? '',
    associatedResourceName: '',
    isAttached: !!associatedResourceId,
    status: basicIp.resourceStatus,
    search: `${basicIp.id} ipv${ipVersion} ${region} ${associatedResourceId}`,
  };
};

const findAssociatedResourceName = (
  basicIp: TBasicIpRow,
  instances: TInstance[],
  gateways: TProjectGateway[],
): string => {
  const matchesResource = ({ id }: { id: string }) =>
    id === basicIp.associatedResourceId;

  switch (basicIp.associatedResourceType) {
    case BASIC_IP_RESOURCE_TYPE.INSTANCE:
      return instances.find(matchesResource)?.name ?? '';
    case BASIC_IP_RESOURCE_TYPE.GATEWAY: {
      const gateway = gateways.find(matchesResource);
      return gateway ? getProjectGatewayName(gateway) : '';
    }
    default:
      return '';
  }
};

/**
 * The public IP API only carries the associated resource id and its kind, so the
 * name shown in the listing is resolved against the project instances and
 * gateways, the way the floating IP listing resolves instance names. An
 * unresolved id (resource deleted, its listing call failing, or a resource kind
 * this app does not know yet) leaves the name empty and the listing falls back
 * to the id.
 */
const withAssociatedResourceName = (
  instances: TInstance[],
  gateways: TProjectGateway[],
) => (basicIp: TBasicIpRow): TBasicIpRow => {
  if (!basicIp.associatedResourceId) return basicIp;

  const associatedResourceName = findAssociatedResourceName(
    basicIp,
    instances,
    gateways,
  );

  return {
    ...basicIp,
    associatedResourceName,
    search: `${basicIp.search} ${associatedResourceName}`,
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

  // Names are only decoration here: a failing instance or gateway call must still
  // let the ip listing render, so those errors are deliberately not surfaced as
  // listing errors.
  const { data: instances, isLoading: areInstancesLoading } = useInstances(
    projectId,
  );

  const { data: gateways, isLoading: areGatewaysLoading } = useProjectGateways(
    projectId,
  );

  return useMemo(
    () => ({
      isLoading: isLoading || areInstancesLoading || areGatewaysLoading,
      error,
      data: paginateResults(
        applyFilters(
          (publicIps || []).map(
            withAssociatedResourceName(instances || [], gateways || []),
          ),
          filters,
        ),
        pagination,
      ),
    }),
    [
      publicIps,
      instances,
      gateways,
      error,
      isLoading,
      areInstancesLoading,
      areGatewaysLoading,
      pagination,
      filters,
    ],
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
