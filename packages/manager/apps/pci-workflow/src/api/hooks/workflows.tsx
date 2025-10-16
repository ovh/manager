import { useMemo } from 'react';

import { queryOptions, useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import { addMinutes, format, parseISO } from 'date-fns';
import * as dateFnsLocales from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

import { Filter, applyFilters } from '@ovh-ux/manager-core-api';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import {
  TRegion,
  getCatalogQuery,
  getProductAvailabilityQuery,
  useProductAvailability,
  useProjectRegions,
} from '@ovh-ux/manager-pci-common';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';

import { getInstance } from '@/api/data/instance';
import {
  TExecutionState,
  TRemoteWorkflow,
  addWorkflow,
  getRegionsWorkflows,
} from '@/api/data/region-workflow';
import { deleteWorkflow } from '@/api/data/workflow';
import { TInstance } from '@/api/hooks/instance/selector/instances.selector';
import { paginateResults } from '@/helpers';
import { isSnapshotConsumption } from '@/pages/new/utils/is-snapshot-consumption';

import { enableRegion } from '../data/region';
import { useMe } from './user';

export const WORKFLOW_TYPE = 'instance_backup';

export type TWorkflow = TRemoteWorkflow & {
  instanceName: string;
  region: string;
  lastExecution: string;
  lastExecutionStatus: TExecutionState;
};

const getWorkflowQueryOptions = (projectId: string, regionName: string) =>
  queryOptions({
    queryKey: [projectId, 'regions', regionName, 'workflows'],
    queryFn: async () => getRegionsWorkflows(projectId, regionName),
  });

export const useWorkflows = (projectId: string) => {
  const { i18n } = useTranslation('pci-common');
  const userLocale = getDateFnsLocale(i18n.language);

  const { data: regions, isPending: isRegionsPending } = useProjectRegions(projectId);

  const filteredRegionNames = useMemo(
    () =>
      (regions || [])
        .filter((region) =>
          region.services.some(({ name, status }) => name === 'workflow' && status === 'UP'),
        )
        .map((region) => region.name),
    [regions],
  );

  return useQueries({
    queries: filteredRegionNames.map((regionName) =>
      getWorkflowQueryOptions(projectId, regionName),
    ),
    combine: (results) => ({
      data: (() =>
        results
          .flatMap((result, i) =>
            result.data
              ? result.data.map((workflow) => ({ ...workflow, region: filteredRegionNames[i] }))
              : null,
          )
          .filter((w) => !!w)
          .map((w) => {
            if (!w.executions) {
              return {
                ...w,
                lastExecution: '',
                lastExecutionStatus: undefined,
              };
            }

            let [lastExecutionAt, lastExecutionStatus]: [Date, TExecutionState | undefined] = [
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
                addMinutes(lastExecutionAt, lastExecutionAt.getTimezoneOffset()),
                'dd MMM yyyy HH:mm:ss',
                {
                  locale: dateFnsLocales[userLocale as keyof typeof dateFnsLocales],
                },
              ),
              lastExecutionStatus,
            };
          }))(),
      isPending: results.some((result) => result.isPending) || isRegionsPending,
    }),
  });
};

export const defaultCompareFunction =
  (key: keyof Omit<TWorkflow, 'executions'>) => (a: TWorkflow, b: TWorkflow) => {
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

    data.sort(defaultCompareFunction(sortKey as keyof Omit<TWorkflow, 'executions'>));
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
          (query) => workflow[key] && workflow[key].toLowerCase().includes(query.toLowerCase()),
        ),
      ),
    );
  }

  return data;
};

export const enum TWorkflowBackup {
  LOCAL = 'local',
  LOCAL_AND_DISTANT = 'local_and_distant',
}

export type TPaginatedWorkflow = TWorkflow & {
  type: string;
  typeLabel: string;
  backup: TWorkflowBackup;
  regions: TRegion['name'][];
};

export const usePaginatedWorkflows = (
  projectId: string,
  {
    pagination,
    sorting,
    filters = [],
    searchQueries = [],
  }: {
    pagination: PaginationState;
    sorting: ColumnSort;
    filters: Filter[];
    searchQueries: string[];
  },
) => {
  const { t } = useTranslation('listing');
  const { data: workflows, isPending: isWorkflowsPending } = useWorkflows(projectId);

  return useQueries({
    queries: workflows.map((workflow) => ({
      queryKey: [projectId, 'instances', workflow.instanceId],
      queryFn: async () => getInstance(projectId, workflow.region, workflow.instanceId),
      staleTime: Infinity,
      enabled: !isWorkflowsPending,
    })),
    combine: (results) => {
      const workflowsWithInstanceIds = workflows.map((workflow, i) => ({
        ...workflow,
        type: WORKFLOW_TYPE,
        typeLabel: t(`pci_workflow_type_${WORKFLOW_TYPE}_title`),
        instanceName: results[i].data?.name,
        backup: !!workflow.distantRegion
          ? TWorkflowBackup.LOCAL_AND_DISTANT
          : TWorkflowBackup.LOCAL,
        regions: []
          .concat(results[i].data ? [results[i].data.region] : [])
          .concat(workflow.distantRegion ? [workflow.distantRegion] : []),
      }));

      return {
        data: paginateResults<TWorkflow>(
          applyFilters(
            sortWorkflows(workflowsWithInstanceIds, sorting, searchQueries) || [],
            filters,
          ),
          pagination,
        ),
        isPending: results.some((result) => result.isPending) || isWorkflowsPending,
      };
    },
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
      const workflowOptions = getWorkflowQueryOptions(projectId, region);
      await queryClient.invalidateQueries(workflowOptions);
      queryClient.setQueryData(workflowOptions.queryKey, (data) => {
        if (data) return data.filter((v) => v.id !== workflowId);
      });
      onSuccess();
    },
  });
  return {
    deleteWorkflow: () => mutation.mutate(),
    ...mutation,
  };
};

interface UseAddWorkflowProps {
  cron: string;
  instanceId: TInstance['id'];
  name: string;
  rotation: number;
  maxExecutionCount: number;
  distantRegion: string | null;
}

export const useAddWorkflow = ({
  projectId,
  onError,
  onSuccess,
}: {
  projectId: string;
  onSuccess: () => void;
  onError: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  const { me } = useMe();

  const { data: productAvailability } = useProductAvailability(projectId, {
    addonFamily: 'snapshot',
  });

  const mutation = useMutation({
    mutationFn: async ({ instanceId, distantRegion, ...type }: UseAddWorkflowProps) => {
      if (
        distantRegion &&
        productAvailability?.plans.find(
          (p) =>
            isSnapshotConsumption(p.code) &&
            p.regions.some((r) => r.name === distantRegion && !r.enabled),
        )
      ) {
        await enableRegion({ projectId, region: distantRegion });
      }

      return addWorkflow(projectId, instanceId.region, {
        ...type,
        instanceId: instanceId.id,
        distantRegion,
      });
    },
    onError,
    onSuccess: async (_res, { instanceId }) => {
      await Promise.all(
        [
          getWorkflowQueryOptions(projectId, instanceId.region),
          getCatalogQuery(me.ovhSubsidiary),
          getProductAvailabilityQuery(projectId, me.ovhSubsidiary, {
            addonFamily: 'snapshot',
          }),
        ].map((query) => queryClient.invalidateQueries(query)),
      );
      onSuccess();
    },
  });

  return {
    addWorkflow: mutation.mutate,
    ...mutation,
  };
};
