import { useQuery } from '@tanstack/react-query';
import {
  getmeTaskDomainArgument,
  getmeTaskDomainId,
  getmeTaskDomainArgumentNames,
  getDomainServiceInfo,
} from '@/data/api/web-ongoing-operations';
import {
  TArgument,
  TDomainTaskV2,
  TFoa,
  TOngoingOperations,
  TServiceInfo,
  TTracking,
} from '@/types';
import { getOperationTrackingStatus } from '@/data/api/tracking';
import { getScheduledTradeTasks, getTaskFoas } from '@/data/api/foa';
import { getMostRecentTask, isPendingFoa } from '@/utils/foa.utils';

export const useTracking = (id: number) => {
  return useQuery<TTracking>({
    queryKey: ['tracking', id],
    queryFn: () => getOperationTrackingStatus(id),
  });
};

export const useDomain = (id: number) => {
  return useQuery<TOngoingOperations>({
    queryKey: ['domain', id],
    queryFn: () => getmeTaskDomainId(id),
  });
};

export const useDomainArgument = (id: number, argumentType: string) => {
  return useQuery<TArgument>({
    queryKey: ['argument', id, argumentType],
    queryFn: () => getmeTaskDomainArgument(id, argumentType),
  });
};

export const useNicList = (id: number) => {
  return useQuery<string[]>({
    queryKey: [id],
    queryFn: () => getmeTaskDomainArgumentNames(id),
  });
};

export const useGetDomainInformation = (serviceName: string) => {
  return useQuery<TServiceInfo>({
    queryKey: [serviceName],
    queryFn: () => getDomainServiceInfo(serviceName),
    retry: 0,
  });
};

export const useScheduledTradeTask = (domainName: string, enabled = true) => {
  return useQuery<TDomainTaskV2 | null>({
    queryKey: ['foa', 'task', domainName],
    queryFn: async () =>
      getMostRecentTask(await getScheduledTradeTasks(domainName)),
    enabled: !!domainName && enabled,
  });
};

export const useTaskFoas = (
  domainName: string,
  taskId: string | null,
  enabled = true,
) => {
  return useQuery<TFoa[]>({
    queryKey: ['foa', domainName, taskId],
    // '' is a sentinel : the query stays disabled while there is no task id
    queryFn: () => getTaskFoas(domainName, taskId ?? ''),
    enabled: !!domainName && !!taskId && enabled,
  });
};

/**
 * Resolve the scheduled change of registrant task of a domain, then the FOAs
 * of that task still waiting for an answer : the designated agent validation
 * is offered only when at least one of them is pending
 */
export const usePendingFoas = (domainName: string, enabled = true) => {
  const { data: task, isLoading: taskLoading } = useScheduledTradeTask(
    domainName,
    enabled,
  );
  const taskId = task?.id ?? null;
  const { data: foas = [], isLoading: foasLoading } = useTaskFoas(
    domainName,
    taskId,
    enabled,
  );

  return {
    taskId,
    foas,
    pendingFoas: foas.filter(isPendingFoa),
    isLoading: taskLoading || (!!taskId && foasLoading),
  };
};
