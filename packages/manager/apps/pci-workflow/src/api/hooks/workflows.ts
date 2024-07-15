import { useQueries } from '@tanstack/react-query';
import moment from 'moment';
import { PaginationState } from '@ovhcloud/manager-components';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { useRegions } from '@/api/hooks/regions';
import {
  getRegionsWorkflows,
  TRemoteWorkflow,
} from '@/api/data/region-workflow';
import { getInstance } from '@/api/data/instance';

export type TWorkflow = {
  name: string;
  id: string;
  instanceId: string;
  instanceName: string;
  cron: string;
  lastExecution: string;
  lastExecutionStatus: string;
  executions: TRemoteWorkflow['executions'];
};

export const paginateResults = (
  items: unknown[],
  pagination: PaginationState,
) => ({
  rows: items.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize,
  ),
  pageCount: Math.ceil(items.length / pagination.pageSize),
  totalRows: items.length,
});

export const useWorkflows = (projectId: string) => {
  const { data: regions, isPending: isRegionsPending } = useRegions(projectId);

  return useQueries({
    queries: (regions || [])
      .reduce((names: string[], { name, services }) => {
        if (
          services.find(
            ({ name: serviceName, status: serviceStatus }) =>
              serviceName === 'workflow' && serviceStatus === 'UP',
          )
        ) {
          return [...names, name];
        }
        return [...names];
      }, [])
      .map((regionName) => ({
        queryKey: ['regions', regionName, 'workflows'],
        queryFn: async () => getRegionsWorkflows(projectId, regionName),

        staleTime: Infinity,
        enabled: !isRegionsPending,
      })),
    combine: (results) => ({
      data: (() =>
        results
          .map((result) => result.data)
          .flat(1)
          .filter((w) => !!w)
          .map((w) => {
            const executions = w.executions.map((execution) => ({
              at: moment(execution.executedAt),
              ...execution,
            }));

            const lastExecution = executions.find(
              (execution) =>
                execution.at === moment.max(executions.map((e) => e.at)),
            );

            return {
              name: w.name,
              id: w.id,
              instanceId: w.instanceId,
              cron: w.cron,
              executions: w.executions,
              lastExecution: lastExecution.at.toISOString(),
              lastExecutionStatus: lastExecution.state,
            };
          }))(),
      isPending: results.some((result) => result.isPending),
    }),
  });
};

export const usePaginatedWorkflows = (
  projectId: string,
  pagination: PaginationState,
  filters: Filter[] = [],
) => {
  const { data: workflows, isPending: isWorkflowsPending } = useWorkflows(
    projectId,
  );

  return useQueries({
    queries: workflows.map((workflow) => ({
      queryKey: ['instances', workflow.instanceId],
      queryFn: async () => getInstance(projectId, workflow.instanceId),
      staleTime: Infinity,
      enabled: !isWorkflowsPending,
    })),
    combine: (results) => ({
      data: (() => {
        const workflowsWithInstanceIds = workflows.map((workflow, i) => ({
          ...workflow,
          instanceName: results[i].data?.name,
        }));
        return paginateResults(
          applyFilters(workflowsWithInstanceIds || [], filters),
          pagination,
        );
      })(),
      isPending: results.some((result) => result.isPending),
    }),
  });
};
