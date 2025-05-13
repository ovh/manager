import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { TWorkflow } from '@/api/hooks/workflows';

type ActionsProps = {
  workflow: TWorkflow;
};
export default function Actions({ workflow }: Readonly<ActionsProps>) {
  const { t } = useTranslation('listing');
  const hrefExecutions = useHref(`./${workflow.id}/executions`);
  const hrefDelete = useHref(`./delete/${workflow.id}`);

  let items = [
    {
      id: 1,
      href: hrefDelete,
      label: t('pci_workflow_delete'),
    },
  ];

  if (Array.isArray(workflow.executions) && workflow.executions.length > 0) {
    items = [
      {
        id: 0,
        href: hrefExecutions,
        label: t('pci_workflow_view_executions'),
      },
      ...items,
    ];
  }

  return <ActionMenu items={items} isCompact />;
}
