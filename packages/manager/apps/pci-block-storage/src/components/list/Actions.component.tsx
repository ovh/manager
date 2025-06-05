import { useHref } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
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
  const { trackClick } = useOvhTracking();

  const hrefEdit = useHref(`./${volume.id}/edit`);
  const hrefAttach = useHref(`./attach/${volume.id}`);
  const hrefDetach = useHref(`./detach/${volume.id}`);
  const hrefRemove = useHref(`./delete/${volume.id}`);
  const hrefCreateBackup = `${projectUrl}/storages/volume-backup/create?volumeId=${volume.id}`;

  const trackingParams = [volume.region, volume.type].join('_');

  const items: (ActionMenuItem & { dataTestid?: string })[] = [
    {
      id: 0,
      href: hrefEdit,
      label: t('pci_projects_project_storages_blocks_edit_label'),
      dataTestid: 'actionComponent-edit-button',
      onClick: () => {
        trackClick({
          buttonType: ButtonType.button,
          location: PageLocation.datagrid,
          actions: ['edit_volume_block_storage', trackingParams],
        });
      },
    },
    volume.canAttachInstance && {
      id: 1,
      href: hrefAttach,
      label: t(`pci_projects_project_storages_blocks_instance_attach_label`),
      dataTestid: 'actionComponent-attach-button',
      onClick: () => {
        trackClick({
          buttonType: ButtonType.button,
          location: PageLocation.datagrid,
          actions: ['attach_instance', trackingParams],
        });
      },
    },
    volume.canDetachInstance && {
      id: 2,
      href: hrefDetach,
      label: t(`pci_projects_project_storages_blocks_instance_detach_label`),
      dataTestid: 'actionComponent-detach-button',
      onClick: () => {
        trackClick({
          buttonType: ButtonType.button,
          location: PageLocation.datagrid,
          actions: ['detach_instance', trackingParams],
        });
      },
    },
    {
      id: 3,
      href: hrefCreateBackup,
      label: t('pci_projects_project_storages_blocks_create_backup_label'),
      dataTestid: 'actionComponent-create-backup-button',
      onClick: () => {
        trackClick({
          buttonType: ButtonType.button,
          location: PageLocation.datagrid,
          actions: ['create_volume_backup', trackingParams],
        });
      },
    },
    {
      id: 4,
      href: hrefRemove,
      label: t('pci_projects_project_storages_blocks_delete_label'),
      dataTestid: 'actionComponent-remove-button',
      onClick: () => {
        trackClick({
          buttonType: ButtonType.button,
          location: PageLocation.datagrid,
          actions: ['delete_volume_block_storage', trackingParams],
        });
      },
    },
  ].filter(Boolean);

  return <ActionMenu items={items} isCompact />;
}
