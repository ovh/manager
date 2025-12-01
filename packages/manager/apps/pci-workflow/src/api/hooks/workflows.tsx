/* eslint-disable max-lines */
import { useMemo } from 'react';

import { queryOptions, useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
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
import { addLastExecution } from '@/api/data/mapper/workflow.mapper';
import {
  TExecutionState,
  TRemoteInstanceBackupWorkflow,
  addInstanceBackupWorkflow,
  getInstanceBackupWorkflows,
} from '@/api/data/region-workflow';
import { deleteWorkflow } from '@/api/data/workflow';
import { paginateResults } from '@/helpers';
import { isSnapshotConsumption } from '@/pages/new/utils/is-snapshot-consumption';

import { enableRegion } from '../data/region';
import { useMe } from './user';

export enum WorkflowType {
  INSTANCE_BACKUP = 'instance_backup',
}

export type TWorkflowRegion = { region: string };
export type TWorkflowLastExecution = {
  lastExecution: string;
  lastExecutionStatus: TExecutionState;
};

export type TInstanceBackupWorkflow = TRemoteInstanceBackupWorkflow &
  TWorkflowRegion &
  TWorkflowLastExecution & {
    instanceName: string;
  };

const getInstanceBackupWorkflowQueryOptions = (projectId: string, regionName: string) =>
  queryOptions({
    queryKey: [projectId, 'regions', regionName, 'instance_backup_workflows'],
    queryFn: async () => getInstanceBackupWorkflows(projectId, regionName),
  });

export const useInstanceBackupWorkflows = (projectId: string) => {
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
      getInstanceBackupWorkflowQueryOptions(projectId, regionName),
    ),
    combine: (results) => ({
      data: (() =>
        results
          .flatMap<(TRemoteInstanceBackupWorkflow & TWorkflowRegion) | null>((result, i) =>
            result.data
              ? result.data.map((workflow) => ({
                  ...workflow,
                  region: filteredRegionNames[i],
                }))
              : null,
          )
          .filter((w) => !!w)
          .map(addLastExecution(userLocale)))(),
      isPending: results.some((result) => result.isPending) || isRegionsPending,
    }),
  });
};

export const defaultCompareFunction =
  (key: keyof Omit<TInstanceBackupWorkflow, 'executions'>) =>
  (a: TInstanceBackupWorkflow, b: TInstanceBackupWorkflow) => {
    const aValue = a[key] || '';
    const bValue = b[key] || '';

    return aValue.localeCompare(bValue);
  };

type SortableWorkflowKeys = keyof Omit<TInstanceBackupWorkflow, 'executions'>;

const isAWorkflowValueContainingSearchQuery =
  (workflow: TInstanceBackupWorkflow, searchQueries: string[]) => (key: SortableWorkflowKeys) => {
    if (!workflow[key]) return false;
    const workflowValue = workflow[key]?.toLowerCase();

    return searchQueries.some(
      (query) => workflowValue && workflowValue.includes(query.toLowerCase()),
    );
  };

export const sortWorkflows =
  (workflows: TInstanceBackupWorkflow[]) => (sorting: ColumnSort | null) => {
    if (!sorting) {
      return workflows;
    }

    const { id: sortKey, desc } = sorting;
    const comparisonFunction = (() => {
      if (sortKey === 'regions') {
        return (a: TInstanceBackupWorkflow, b: TInstanceBackupWorkflow) =>
          a.region.localeCompare(b.region);
      } else {
        return defaultCompareFunction(sortKey as keyof Omit<TInstanceBackupWorkflow, 'executions'>);
      }
    })();
    const sortedData = [...workflows].sort(comparisonFunction);

    return desc ? sortedData.reverse() : sortedData;
  };

export const sortAndFilterWorkflows = (
  workflows: TInstanceBackupWorkflow[],
  sorting: ColumnSort,
  searchQueries: string[],
): TInstanceBackupWorkflow[] => {
  const sortedData = sortWorkflows(workflows)(sorting);

  if (searchQueries.length) {
    const keys: SortableWorkflowKeys[] = ['name', 'instanceName', 'cron'];
    return sortedData.filter((workflow) =>
      keys.some(isAWorkflowValueContainingSearchQuery(workflow, searchQueries)),
    );
  }

  return sortedData;
};

export const enum TWorkflowBackup {
  LOCAL = 'local',
  LOCAL_AND_DISTANT = 'local_and_distant',
}

export type TPaginatedWorkflow = TInstanceBackupWorkflow & {
  type: string;
  typeLabel: string;
  backup: TWorkflowBackup;
  regions: TRegion['name'][];
};

export const usePaginatedInstanceBackupWorkflows = (
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
  const { data: workflows, isPending: isWorkflowsPending } = useInstanceBackupWorkflows(projectId);

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
        type: WorkflowType.INSTANCE_BACKUP,
        typeLabel: t(`pci_workflow_type_${WorkflowType.INSTANCE_BACKUP}_title`),
        instanceName: results[i].data?.name,
        backup: !!workflow.distantRegion
          ? TWorkflowBackup.LOCAL_AND_DISTANT
          : TWorkflowBackup.LOCAL,
        regions: []
          .concat(results[i].data ? [results[i].data.region] : [])
          .concat(workflow.distantRegion ? [workflow.distantRegion] : []),
      }));

      return {
        data: paginateResults<TInstanceBackupWorkflow>(
          applyFilters(
            sortAndFilterWorkflows(workflowsWithInstanceIds, sorting, searchQueries) || [],
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
      const workflowOptions = getInstanceBackupWorkflowQueryOptions(projectId, region);
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

export type TWorkflowResourceId = { id: string; region: string };
export type TWorkflowSelectedResource = TWorkflowResourceId & { label: string };

interface UseAddWorkflowProps {
  type: WorkflowType;
  resourceId: TWorkflowResourceId;
  name: string;
  cron: string;
  rotation: number;
  maxExecutionCount: number;
}

type UseAddInstanceBackupWorkflowProps = UseAddWorkflowProps & {
  type: WorkflowType.INSTANCE_BACKUP;
  distantRegion: string | null;
};

export const useAddWorkflow = ({
  projectId,
  onError,
  onSuccess,
}: {
  projectId: string;
  onSuccess: () => void;
  onError: (error: Error) => void;
}) => {
  const { addInstanceBackupWorkflow, isPending: isAddingInstanceBackupWorkflow } =
    useAddInstanceBackupWorkflow({
      projectId,
      onError,
      onSuccess,
    });

  const addWorkflow = (props: UseAddInstanceBackupWorkflowProps) => {
    if (props.type === WorkflowType.INSTANCE_BACKUP) {
      addInstanceBackupWorkflow(props);
    }
  };

  return {
    addWorkflow,
    isPending: isAddingInstanceBackupWorkflow,
  };
};

export const useAddInstanceBackupWorkflow = ({
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
    mutationFn: async ({
      resourceId,
      distantRegion,
      ...rest
    }: UseAddInstanceBackupWorkflowProps) => {
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

      return addInstanceBackupWorkflow(projectId, resourceId.region, resourceId.id, {
        name: rest.name,
        cron: rest.cron,
        rotation: rest.rotation,
        imageName: '',
        distantRegionName: distantRegion,
        distantImageName: null,
      });
    },
    onError,
    onSuccess: async (_res, { resourceId }) => {
      await Promise.all(
        [
          getInstanceBackupWorkflowQueryOptions(projectId, resourceId.region),
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
    addInstanceBackupWorkflow: mutation.mutate,
    ...mutation,
  };
};
