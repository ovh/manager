import { useHref } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import { TVolume } from '@/api/hooks/useVolume';
import { useTrackAction } from '@/hooks/useTrackAction';

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

  const onTrackingClick = useTrackAction<(actionName: string) => void>(
    (actionName) => ({
      actionName,
      buttonType: 'button',
      actionValues: [volume.region, volume.type],
    }),
  );

  const items: (ActionMenuItem & { dataTestid?: string })[] = [
    {
      id: 0,
      href: hrefEdit,
      label: t('pci_projects_project_storages_blocks_edit_label'),
      dataTestid: 'actionComponent-edit-button',
      onClick: () => onTrackingClick('edit_volume_block_storage'),
    },
    volume.canAttachInstance && {
      id: 1,
      href: hrefAttach,
      label: t(`pci_projects_project_storages_blocks_instance_attach_label`),
      dataTestid: 'actionComponent-attach-button',
      onClick: () => onTrackingClick('attach_instance'),
    },
    volume.canDetachInstance && {
      id: 2,
      href: hrefDetach,
      label: t(`pci_projects_project_storages_blocks_instance_detach_label`),
      dataTestid: 'actionComponent-detach-button',
      onClick: () => onTrackingClick('detach_instance'),
    },
    {
      id: 3,
      href: hrefCreateBackup,
      label: t('pci_projects_project_storages_blocks_create_backup_label'),
      dataTestid: 'actionComponent-create-backup-button',
      onClick: () => onTrackingClick('create_volume_backup'),
    },
    {
      id: 4,
      href: hrefRemove,
      label: t('pci_projects_project_storages_blocks_delete_label'),
      dataTestid: 'actionComponent-remove-button',
      onClick: () => onTrackingClick('delete_volume_block_storage'),
    },
  ].filter(Boolean);

  return <ActionMenu items={items} isCompact />;
}
