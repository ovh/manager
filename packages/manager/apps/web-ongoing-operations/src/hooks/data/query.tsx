import { useQuery } from '@tanstack/react-query';
import {
  getmeTaskDomainArgument,
  getmeTaskDomainId,
  getmeTaskDomainArgumentNames,
  getDomainServiceInfo,
} from '@/data/api/web-ongoing-operations';
import {
  TArgument,
  TDomainResource,
  TDomainTaskV2,
  TFoa,
  TOngoingOperations,
  TServiceInfo,
  TTracking,
} from '@/types';
import { getOperationTrackingStatus } from '@/data/api/tracking';
import {
  getDomainResource,
  getScheduledTradeTasks,
  getTaskFoas,
} from '@/data/api/foa';
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

/**
 * The registry verdict is an authorization, so it is never served stale : the
 * app wide staleTime would otherwise keep a five minutes old answer — and fire
 * no request at all when walking from the listing to the certification page,
 * which makes the check look absent from the network panel.
 */
export const useDomainResource = (domainName: string, enabled = true) => {
  return useQuery<TDomainResource | null>({
    queryKey: ['foa', 'domain', domainName],
    queryFn: () => getDomainResource(domainName),
    enabled: !!domainName && enabled,
    staleTime: 0,
  });
};

// Live task, live answers : both are refetched on mount rather than served
// from the app wide staleTime, so an answer landed meanwhile is seen at once
export const useScheduledTradeTask = (domainName: string, enabled = true) => {
  return useQuery<TDomainTaskV2 | null>({
    queryKey: ['foa', 'task', domainName],
    queryFn: async () =>
      getMostRecentTask(await getScheduledTradeTasks(domainName)),
    enabled: !!domainName && enabled,
    staleTime: 0,
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
    staleTime: 0,
  });
};

/**
 * Resolve the scheduled change of registrant task of a domain, then the FOAs
 * of that task still waiting for an answer : the designated agent validation
 * is offered only when at least one of them is pending, and only while the
 * registry does not forbid the procedure on the domain
 * (currentState.designatedAgentAllowed of the APIv2 domain resource).
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
  const pendingFoas = foas.filter(isPendingFoa);
  const hasPendingFoas = pendingFoas.length > 0;
  // Only asked once a FOA is actually answerable : the verdict is pointless
  // otherwise, and the request would be spent on every trade row of the page
  const { data: domainResource, isLoading: domainLoading } = useDomainResource(
    domainName,
    enabled && hasPendingFoas,
  );

  return {
    taskId,
    foas,
    pendingFoas,
    // Hidden only on an explicit refusal : an unknown verdict fails open, the
    // API stays the real authorization gate
    isDesignatedAgentAllowed:
      domainResource?.currentState?.designatedAgentAllowed !== false,
    isLoading:
      taskLoading ||
      (!!taskId && foasLoading) ||
      (hasPendingFoas && domainLoading),
  };
};
