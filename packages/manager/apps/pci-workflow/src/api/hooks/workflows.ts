import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { PaginationState } from '@ovhcloud/manager-components';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { useRef } from 'react';
import * as dateFnsLocales from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { useRegions } from '@/api/hooks/regions';
import {
  addWorkflow,
  getRegionsWorkflows,
  TExecutionState,
  TWorkflowExecution,
} from '@/api/data/region-workflow';
import { getInstance } from '@/api/data/instance';
import { deleteWorkflow } from '@/api/data/workflow';
import { paginateResults } from '@/helpers';

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

export const useWorkflows = (projectId: string) => {
  const { i18n } = useTranslation('common');
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
            let [lastExecutionAt, lastExecutionStatus] = [
              new Date(),
              undefined,
            ];

            if (Array.isArray(w.executions) && w.executions.length) {
              const executions = w.executions
                .map((execution) => ({
                  at: parseISO(execution.executedAt),
                  ...execution,
                }))
                .sort((a, b) => b.at.getTime() - a.at.getTime());

              lastExecutionAt = executions[0].at;
              lastExecutionStatus = executions[0].state;
            }

            return {
              ...w,
              lastExecution: format(lastExecutionAt, 'dd MMM yyyy HH:mm:ss', {
                locale: locales[userLocale],
              }),
              lastExecutionStatus,
            };
          }))(),
      isPending: results.some((result) => result.isPending) || isRegionsPending,
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
        return paginateResults<TWorkflow>(
          applyFilters(workflowsWithInstanceIds || [], filters),
          pagination,
        );
      })(),
      isPending:
        results.some((result) => result.isPending) || isWorkflowsPending,
    }),
  });
};

type DeleteVolumeProps = {
  projectId: string;
  workflowId: string;
  region: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};
export const useDeleteWorkflow = ({
  projectId,
  workflowId,
  region,
  onError,
  onSuccess,
}: DeleteVolumeProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => deleteWorkflow(projectId, region, workflowId),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['regions', region, 'workflows'],
      });
      queryClient.setQueryData(
        ['regions', region, 'workflows'],
        (data: { id: string }[]) => data.filter((v) => v.id !== workflowId),
      );
      onSuccess();
    },
  });
  return {
    deleteWorkflow: () => mutation.mutate(),
    ...mutation,
  };
};

interface UseAddWorkflowProps {
  projectId: string;
  region: string;
  type: {
    cron: string;
    instanceId: string;
    name: string;
    rotation: number;
    maxExecutionCount: number;
  };
  onError: (error: Error) => void;
  onSuccess: () => void;
}

export const useAddWorkflow = ({
  projectId,
  region,
  type,
  onError,
  onSuccess,
}: UseAddWorkflowProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => addWorkflow(projectId, region, type),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['regions', region, 'workflows'],
      });
      onSuccess();
    },
  });

  return {
    addWorkflow: () => mutation.mutate(),
    ...mutation,
  };
};
