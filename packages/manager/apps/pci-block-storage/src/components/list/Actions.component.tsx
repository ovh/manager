import { useHref } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { TVolume } from '@/api/hooks/useVolume';

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
  const hrefRetype = useHref(`./retype/${volume.id}`);
  const hrefCreateBackup = `${projectUrl}/storages/volume-backup/create?volumeId=${volume.id}`;

  const items = [
    {
      id: 0,
      href: hrefEdit,
      label: t('pci_projects_project_storages_blocks_edit_label'),
      dataTestid: 'actionComponent-edit-button',
    },
    volume.canAttachInstance && {
      id: 1,
      href: hrefAttach,
      label: t(`pci_projects_project_storages_blocks_instance_attach_label`),
      dataTestid: 'actionComponent-attach-button',
    },
    volume.canDetachInstance && {
      id: 2,
      href: hrefDetach,
      label: t(`pci_projects_project_storages_blocks_instance_detach_label`),
      dataTestid: 'actionComponent-detach-button',
    },
    {
      id: 3,
      href: hrefCreateBackup,
      label: t('pci_projects_project_storages_blocks_create_backup_label'),
      dataTestid: 'actionComponent-create-backup-button',
    },
    {
      id: 4,
      href: hrefRetype,
      label: t('pci_projects_project_storages_blocks_change_encryption'),
      dataTestid: 'actionComponent-change-encryption-button',
    },
    {
      id: 5,
      href: hrefRetype,
      label: t('pci_projects_project_storages_blocks_change_type'),
      dataTestid: 'actionComponent-retype-button',
    },
    {
      id: 6,
      href: hrefRemove,
      label: t('pci_projects_project_storages_blocks_delete_label'),
      dataTestid: 'actionComponent-remove-button',
    },
  ].filter(Boolean);

  return <ActionMenu items={items} isCompact />;
}
