import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { ActionMenu } from '@ovhcloud/manager-components';

type ActionsProps = {
  projectId: string;
  backupId: string;
};
export default function Actions({ backupId }: Readonly<ActionsProps>) {
  const { t } = useTranslation();
  const hrefExecutions = useHref(`./${backupId}`);
  const hrefDelete = useHref(`./delete?workflowId=${backupId}`);

  const items = [
    {
      id: 0,
      href: hrefExecutions,
      label: t('pci_workflow_view_executions'),
    },
    {
      id: 1,
      href: hrefDelete,
      label: t('pci_workflow_delete'),
    },
  ];

  return <ActionMenu items={items} isCompact />;
}
