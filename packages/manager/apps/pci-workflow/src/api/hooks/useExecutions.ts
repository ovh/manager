import { useMemo, useRef } from 'react';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { format, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import * as dateFnsLocales from 'date-fns/locale';
import { TWorkflowExecution } from '../data/region-workflow';
import { useWorkflows } from './workflows';
import { paginateResults } from '@/helpers';

export const defaultCompareFunction = (key: keyof TWorkflowExecution) => (
  a: TWorkflowExecution,
  b: TWorkflowExecution,
) => {
  const aValue = a[key] || '';
  const bValue = b[key] || '';

  return aValue.localeCompare(bValue);
};

export const sortExecutions = (
  executions: TWorkflowExecution[],
  sorting: ColumnSort,
): TWorkflowExecution[] => {
  const data = [...executions];

  if (sorting) {
    const { id: sortKey, desc } = sorting;

    data.sort(defaultCompareFunction(sortKey as keyof TWorkflowExecution));
    if (desc) {
      data.reverse();
    }
  }

  return data;
};

export const useWorkflowExecutions = (
  projectId: string,
  workflowId: string,
  { pagination, sorting }: { pagination: PaginationState; sorting: ColumnSort },
) => {
  const { i18n } = useTranslation('pci-common');
  const locales = useRef({ ...dateFnsLocales }).current;
  const userLocale = getDateFnsLocale(i18n.language);

  const { data: workflows, isPending: isWorkflowPending } = useWorkflows(
    projectId,
  );

  return useMemo(() => {
    let mappedExecution: TWorkflowExecution[] = [];
    const workflow = workflows?.find((w) => w.id === workflowId);
    const executions = workflow?.executions;

    if (Array.isArray(executions) && executions.length > 0) {
      mappedExecution = executions.map((exec) => ({
        ...exec,
        executedAtDate: format(
          // remove Z timezone to treat as UTC date
          parseISO(exec.executedAt?.replace(/Z$/, '')),
          "dd MMMM'.' yyyy",
          {
            locale: locales[userLocale],
          },
        ),
        executedAtTime: format(
          // remove Z timezone to treat as UTC date
          parseISO(exec.executedAt?.replace(/Z$/, '')),
          'hh:mm:ss',
          {
            locale: locales[userLocale],
          },
        ),
      }));
    }

    return {
      isPending: isWorkflowPending,
      data: {
        executions: paginateResults<TWorkflowExecution>(
          sortExecutions(mappedExecution, sorting) || [],
          pagination,
        ),
        workflowName: workflow?.name,
      },
    };
  }, [workflows, isWorkflowPending, sorting, pagination]);
};
