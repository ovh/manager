import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { ActionMenu } from '@ovhcloud/manager-components';

type ActionsProps = {
  backupId: string;
  isExecutionsAvailable: boolean;
};

export default function Actions({
  backupId,
  isExecutionsAvailable,
}: Readonly<ActionsProps>) {
  const { t } = useTranslation('listing');

  const hrefExecutions = useHref(`./${backupId}/executions`);
  const hrefDelete = useHref(`./delete?workflowId=${backupId}`);

  const executionsItem = {
    id: 0,
    href: hrefExecutions,
    label: t('pci_workflow_view_executions'),
  };

  const items = [
    isExecutionsAvailable ? executionsItem : undefined,
    {
      id: 1,
      href: hrefDelete,
      label: t('pci_workflow_delete'),
    },
  ].filter((item) => item);

  return <ActionMenu items={items} isCompact />;
}
