import { useQueries } from '@tanstack/react-query';
import { parseISO, format } from 'date-fns';
import { PaginationState } from '@ovhcloud/manager-components';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { useRef } from 'react';
import * as dateFnsLocales from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { useRegions } from '@/api/hooks/regions';
import {
  getRegionsWorkflows,
  TExecutionState,
  TWorkflowExecution,
} from '@/api/data/region-workflow';
import { getInstance } from '@/api/data/instance';

export type TWorkflow = {
  name: string;
  id: string;
  instanceId: string;
  instanceName: string;
  cron: string;
  lastExecution: string;
  lastExecutionStatus: TExecutionState;
  executions: TWorkflowExecution[];
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
  const { i18n, t } = useTranslation('common');

  const locales = useRef({ ...dateFnsLocales }).current;

  const userLocale = getDateFnsLocale(i18n.language);

  const { data: regions, isPending: isRegionsPending } = useRegions(projectId);

  return useQueries({
    queries: (regions || [])
      .filter((region) =>
        region.services.some(
          ({ name, status }) => name === 'workflow' && status === 'UP',
        ),
      )
      .map((region) => region.name)
      .map((regionName) => ({
        queryKey: ['regions', regionName, 'workflows'],
        queryFn: async () => getRegionsWorkflows(projectId, regionName),
        enabled: !isRegionsPending,
      })),
    combine: (results) => ({
      data: (() =>
        results
          .map((result) => result.data)
          .flat(1)
          .filter((w) => !!w)
          .map((w) => {
            const executions = w.executions
              .map((execution) => ({
                at: parseISO(execution.executedAt),
                ...execution,
              }))
              .sort((a, b) => b.at.getTime() - a.at.getTime());

            return {
              ...w,
              lastExecution: format(executions[0].at, 'dd MMM yyyy HH:mm:ss', {
                locale: locales[userLocale],
              }),
              lastExecutionStatus: executions[0].state,
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
