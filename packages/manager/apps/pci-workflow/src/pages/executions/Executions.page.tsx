import {
  Datagrid,
  Headers,
  useDatagridSearchParams,
  useProject,
  useProjectUrl,
} from '@ovhcloud/manager-components';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsBreadcrumb, OsdsSpinner } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useHref, useParams } from 'react-router-dom';
import { useWorkflowExecutions } from '@/api/hooks/useExecutions';
import { useExecutionDatagridColumns } from './useExecutionDatagridColumns';

export default function Executions() {
  const { t: tExecution } = useTranslation('executions');

  const { projectId, workflowId } = useParams();
  const { data: project } = useProject();
  const hrefProject = useProjectUrl('public-cloud');
  const backHref = useHref('..');

  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
  } = useDatagridSearchParams();

  const {
    data: { executions, workflowName },
    isPending,
  } = useWorkflowExecutions(projectId, workflowId, {
    pagination,
    sorting,
  });

  const columns = useExecutionDatagridColumns();

  return (
    <div>
      {project && (
        <OsdsBreadcrumb
          items={[
            {
              href: hrefProject,
              label: project.description,
            },
            {
              label: tExecution('pci_workflow_title'),
              href: backHref,
            },
            {
              label: tExecution('pci_workflow_executions'),
            },
          ]}
        />
      )}

      {workflowName && (
        <div className="header mt-8">
          <Headers
            title={tExecution('pci_workflow_executions_title', {
              workflowName,
            })}
          />
        </div>
      )}

      {isPending && (
        <div className="text-center">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        </div>
      )}

      {!isPending && (
        <div className="mt-8">
          <Datagrid
            columns={columns}
            items={executions.rows || []}
            totalItems={executions.totalRows || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
            sorting={sorting}
            onSortChange={setSorting}
          />
        </div>
      )}
    </div>
  );
}
