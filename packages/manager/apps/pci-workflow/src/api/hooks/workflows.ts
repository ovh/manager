import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import { addMinutes, format, parseISO } from 'date-fns';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { useMemo, useRef } from 'react';
import * as dateFnsLocales from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { getInstance, useProjectRegions } from '@ovh-ux/manager-pci-common';
import {
  addWorkflow,
  getRegionsWorkflows,
  TExecutionState,
  TRemoteWorkflow,
} from '@/api/data/region-workflow';
import { deleteWorkflow } from '@/api/data/workflow';
import { paginateResults } from '@/helpers';

export const WORKFLOW_TYPE = 'instance_backup';

export type TWorkflow = TRemoteWorkflow & {
  instanceName: string;
  lastExecution: string;
  lastExecutionStatus: TExecutionState;
};

export const useWorkflows = (projectId: string) => {
  const { i18n } = useTranslation('pci-common');
  const locales = useRef({ ...dateFnsLocales }).current;
  const userLocale = getDateFnsLocale(i18n.language);

  const { data: regions, isPending: isRegionsPending } = useProjectRegions(
    projectId,
  );

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
            if (!w.executions) {
              return {
                ...w,
                lastExecution: '',
                lastExecutionStatus: undefined,
              };
            }

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
              lastExecution: format(
                addMinutes(
                  lastExecutionAt,
                  lastExecutionAt.getTimezoneOffset(),
                ),
                'dd MMM yyyy HH:mm:ss',
                {
                  locale: locales[userLocale],
                },
              ),
              lastExecutionStatus,
            };
          }))(),
      isPending: results.some((result) => result.isPending) || isRegionsPending,
    }),
  });
};

export const defaultCompareFunction = (
  key: keyof Omit<TWorkflow, 'executions'>,
) => (a: TWorkflow, b: TWorkflow) => {
  const aValue = a[key] || '';
  const bValue = b[key] || '';

  return aValue.localeCompare(bValue);
};

export const sortWorkflows = (
  workflows: TWorkflow[],
  sorting: ColumnSort,
  searchQueries: string[],
): TWorkflow[] => {
  const data = [...workflows];

  if (sorting) {
    const { id: sortKey, desc } = sorting;

    data.sort(
      defaultCompareFunction(sortKey as keyof Omit<TWorkflow, 'executions'>),
    );
    if (desc) {
      data.reverse();
    }
  }

  if (searchQueries.length) {
    type WorkflowKeys = keyof Omit<TWorkflow, 'executions'>;
    const keys: WorkflowKeys[] = ['name', 'instanceName', 'cron'];
    return data.filter((workflow) =>
      keys.some((key) =>
        searchQueries.some(
          (query) =>
            workflow[key] &&
            workflow[key].toLowerCase().includes(query.toLowerCase()),
        ),
      ),
    );
  }

  return data;
};

export type TPaginatedWorkflow = TWorkflow & {
  type: string;
  typeLabel: string;
};

export const usePaginatedWorkflows = (
  projectId: string,
  pagination: PaginationState,
  sorting: ColumnSort,
  filters: Filter[] = [],
  searchQueries: string[] = [],
) => {
  const { t } = useTranslation('listing');
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
      data: useMemo(() => {
        const workflowsWithInstanceIds = workflows.map((workflow, i) => ({
          ...workflow,
          type: WORKFLOW_TYPE,
          typeLabel: t(`pci_workflow_type_${WORKFLOW_TYPE}_title`),
          instanceName: results[i].data?.name,
        }));
        return paginateResults<TWorkflow>(
          applyFilters(
            sortWorkflows(workflowsWithInstanceIds, sorting, searchQueries) ||
              [],
            filters,
          ),
          pagination,
        );
      }, [workflows, sorting, filters, searchQueries, results]),
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
