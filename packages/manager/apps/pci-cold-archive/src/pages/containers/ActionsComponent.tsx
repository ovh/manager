import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { TArchiveContainer } from '@/api/data/archive';
import {
  COLD_ARCHIVE_CONTAINER_STATUS,
  COLD_ARCHIVE_TRACKING,
} from '@/constants';

export default function ActionsComponent({
  archive,
}: Readonly<{
  archive: TArchiveContainer;
}>) {
  const { t } = useTranslation(['cold-archive', 'containers']);
  const navigate = useNavigate();
  const { tracking } = useContext(ShellContext).shell;

  const isActionAddUserAvailable = [
    COLD_ARCHIVE_CONTAINER_STATUS.NONE,
    COLD_ARCHIVE_CONTAINER_STATUS.ARCHIVED,
    COLD_ARCHIVE_CONTAINER_STATUS.RESTORED,
  ].includes(archive.status);

  const isActionRestoredAvailable = [
    COLD_ARCHIVE_CONTAINER_STATUS.ARCHIVED,
  ].includes(archive.status);

  const isActionArchiveAvailable =
    archive.objectsCount > 0 &&
    [COLD_ARCHIVE_CONTAINER_STATUS.NONE].includes(archive.status);

  const isActionEditRetentionContainerAvailable = [
    COLD_ARCHIVE_CONTAINER_STATUS.ARCHIVED,
    COLD_ARCHIVE_CONTAINER_STATUS.RESTORED,
  ].includes(archive.status);

  const isActionFlushContainerAvailable = () => {
    const validStatuses = [
      COLD_ARCHIVE_CONTAINER_STATUS.ARCHIVED,
      COLD_ARCHIVE_CONTAINER_STATUS.RESTORED,
    ];

    if (archive.lockedUntil) {
      return (
        new Date(archive.lockedUntil) < new Date() &&
        validStatuses.includes(archive.status)
      );
    }

    return validStatuses.includes(archive.status);
  };

  const isActionDeleteContainerAvailable = [
    COLD_ARCHIVE_CONTAINER_STATUS.NONE,
    COLD_ARCHIVE_CONTAINER_STATUS.FLUSHED,
  ].includes(archive.status);

  const isActionsAvailable = [
    isActionAddUserAvailable,
    isActionArchiveAvailable,
    isActionRestoredAvailable,
    isActionFlushContainerAvailable(),
    isActionEditRetentionContainerAvailable,
    isActionDeleteContainerAvailable,
  ].some((isActionAvailable) => isActionAvailable === true);

  const items = [
    isActionAddUserAvailable
      ? {
          id: 0,
          label: t(
            'pci_projects_project_storages_cold_archive_container_action_add_user',
          ),
          onClick: () => {
            tracking?.trackClick({
              name: `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_USER}`,
              type: 'navigation',
            });
            navigate(`./add-user/${archive.name}`);
          },
        }
      : undefined,
    isActionRestoredAvailable
      ? {
          id: 1,
          label: t(
            'pci_projects_project_storages_cold_archive_container_action_restore',
          ),
          onClick: () => {
            tracking?.trackClick({
              name: `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.RESTORE}`,
              type: 'navigation',
            });
            navigate(`./restore/${archive.name}`);
          },
        }
      : undefined,
    isActionEditRetentionContainerAvailable
      ? {
          id: 2,
          label: t(
            'containers:pci_projects_project_storages_cold_archive_container_action_edit_retention',
          ),
          onClick: () => {
            tracking?.trackClick({
              name: `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.EDIT_RETENTION}`,
              type: 'navigation',
            });
            navigate(`./edit-retention/${archive.name}`);
          },
        }
      : undefined,
    isActionFlushContainerAvailable()
      ? {
          id: 6,
          label: t(
            'pci_projects_project_storages_cold_archive_container_action_flush_archive',
          ),
          onClick: () => {
            tracking?.trackClick({
              name: `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.FLUSH_CONTAINER}`,
              type: 'navigation',
            });
            navigate(`./flush-archive/${archive.name}`);
          },
        }
      : undefined,
    isActionArchiveAvailable
      ? {
          id: 3,
          label: t(
            'pci_projects_project_storages_cold_archive_container_action_archive',
          ),
          onClick: () => {
            tracking?.trackClick({
              name: `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.ARCHIVE}`,
              type: 'navigaton',
            });
            navigate(`./archive/${archive.name}`);
          },
        }
      : undefined,
    isActionDeleteContainerAvailable
      ? {
          id: 4,
          label: t(
            'pci_projects_project_storages_cold_archive_container_action_delete_container',
          ),
          onClick: () => {
            tracking?.trackClick({
              name: `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.DELETE_CONTAINER}`,
              type: 'navigation',
            });
            navigate(`./delete-container/${archive.name}`);
          },
        }
      : undefined,
  ].filter(Boolean);

  return isActionsAvailable ? (
    <ActionMenu id={archive.name} items={items} isCompact />
  ) : (
    <></>
  );
}
