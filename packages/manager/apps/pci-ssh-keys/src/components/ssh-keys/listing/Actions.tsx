import { useHref } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';

export default function Actions({ sshId }: { sshId: string }) {
  const { t } = useTranslation('common');
  const hrefRemove = useHref(`./${sshId}/remove`);
  const items = [
    {
      id: 0,
      label: t('pci_projects_project_sshKeys_remove'),
      href: hrefRemove,
    },
  ];
  return <ActionMenu items={items} isCompact />;
}
