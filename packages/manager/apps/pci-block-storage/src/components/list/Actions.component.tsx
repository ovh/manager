import { useHref } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { TVolume } from '@/api/data/volume';

type ActionsProps = {
  volume: TVolume;
  projectUrl: string;
};
export default function ActionsComponent({
  volume,
  projectUrl,
}: Readonly<ActionsProps>) {
  const { t } = useTranslation();
  const hrefEdit = useHref(`./${volume.id}/edit`);
  const hrefAttach = useHref(`./attach/${volume.id}`);
  const hrefDetach = useHref(`./detach/${volume.id}`);
  const hrefRemove = useHref(`./delete/${volume.id}`);
  const hrefCreateBackup = `${projectUrl}/storages/volume-backup/create?volumeId=${volume.id}`;

  const items = [
    {
      id: 0,
      href: hrefEdit,
      label: t('pci_projects_project_storages_blocks_edit_label'),
      dataTestid: 'actionComponent-edit-button',
    },
    {
      id: 1,
      href: volume.attachedTo?.length ? hrefDetach : hrefAttach,
      label: t(
        `pci_projects_project_storages_blocks_instance_${
          volume.attachedTo?.length ? 'detach' : 'attach'
        }_label`,
      ),
      dataTestid: 'actionComponent-attach-detach-button',
    },
    {
      id: 2,
      href: hrefCreateBackup,
      label: t('pci_projects_project_storages_blocks_create_backup_label'),
      dataTestid: 'actionComponent-create-backup-button',
    },
    {
      id: 3,
      href: hrefRemove,
      label: t('pci_projects_project_storages_blocks_delete_label'),
      dataTestid: 'actionComponent-remove-button',
    },
  ];

  return <ActionMenu items={items} isCompact />;
}
