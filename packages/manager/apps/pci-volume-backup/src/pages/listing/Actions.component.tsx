// import { useTranslation } from 'react-i18next';
// import { useHref } from 'react-router-dom';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { TVolumeBackup } from '@/data/api/api.types';

type ActionsProps = {
  backup: TVolumeBackup;
};

export default function Actions({ backup }: Readonly<ActionsProps>) {
  // const { t } = useTranslation('listing');

  const items: { id: number; href: string; label: string }[] = [
    // {
    //   id: 1,
    //   href: useHref(`./${backup.id}/new-volume`),
    //   label: t('pci_projects_project_storages_snapshots_create_volume_label'),
    // },
    // {
    //   id: 2,
    //   href: useHref(`./delete?snapshotId=${backup.id}`),
    //   label: t('pci_projects_project_storages_snapshots_delete_label'),
    // },
  ];

  return <ActionMenu id={backup.id} items={items} isCompact />;
}
