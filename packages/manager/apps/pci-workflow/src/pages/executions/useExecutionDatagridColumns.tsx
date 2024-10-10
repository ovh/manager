import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { TWorkflowExecution } from '@/api/data/region-workflow';
import ExecutionStatusComponent from '@/components/execution-status.component';

export const useExecutionDatagridColumns = () => {
  const { t: tExecution } = useTranslation('executions');

  return [
    {
      id: 'executedAtDate',
      cell: (props: TWorkflowExecution) => (
        <DataGridTextCell>{props.executedAtDate}</DataGridTextCell>
      ),
      label: tExecution('pci_workflow_executions_ececution_date'),
    },
    {
      id: 'executedAtTime',
      cell: (props: TWorkflowExecution) => (
        <DataGridTextCell>{props.executedAtTime}</DataGridTextCell>
      ),
      label: tExecution('pci_workflow_executions_ececution_time'),
      isSortable: false,
    },
    {
      id: 'state',
      cell: (props: TWorkflowExecution) => (
        <ExecutionStatusComponent status={props.state} />
      ),
      label: tExecution('pci_workflow_executions_status'),
    },
  ];
};
