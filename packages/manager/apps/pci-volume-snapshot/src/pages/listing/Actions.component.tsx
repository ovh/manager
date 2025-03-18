import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { TVolumeSnapshot } from '@/api/hooks/useSnapshots';

type ActionsProps = {
  snapshot: TVolumeSnapshot;
};

export default function Actions({ snapshot }: Readonly<ActionsProps>) {
  const { t } = useTranslation('volumes');

  const items = [
    {
      id: 1,
      href: useHref('#'),
      label: t('pci_projects_project_storages_snapshots_create_volume_label'),
    },
    {
      id: 2,
      href: useHref('#'),
      label: t('pci_projects_project_storages_snapshots_delete_label'),
    },
  ];

  return <ActionMenu id={snapshot.id} items={items} isCompact />;
}
