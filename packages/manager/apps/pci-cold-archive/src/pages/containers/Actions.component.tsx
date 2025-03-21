import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { TArchiveContainer } from '@/api/data/archive';
import { COLD_ARCHIVE_CONTAINER_STATUS } from '@/constants';
import { useTracking } from '@/hooks/useTracking';
import { COLD_ARCHIVE_TRACKING } from '@/tracking.constants';

export default function ActionsComponent({
  archive,
}: Readonly<{
  archive: TArchiveContainer;
}>) {
  const { t } = useTranslation(['cold-archive', 'containers']);
  const navigate = useNavigate();

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

  const { trackNavigationClick } = useTracking(
    COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN,
  );

  const items = [
    isActionAddUserAvailable
      ? {
          id: 0,
          label: t(
            'pci_projects_project_storages_cold_archive_container_action_add_user',
          ),
          onClick: () => {
            trackNavigationClick(COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_USER);
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
            trackNavigationClick(COLD_ARCHIVE_TRACKING.CONTAINERS.RESTORE);
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
            trackNavigationClick(
              COLD_ARCHIVE_TRACKING.CONTAINERS.EDIT_RETENTION,
            );
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
            trackNavigationClick(
              COLD_ARCHIVE_TRACKING.CONTAINERS.FLUSH_CONTAINER,
            );
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
            trackNavigationClick(COLD_ARCHIVE_TRACKING.CONTAINERS.ARCHIVE);
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
            trackNavigationClick(
              COLD_ARCHIVE_TRACKING.CONTAINERS.DELETE_CONTAINER,
            );
            navigate(`./delete-container/${archive.name}`);
          },
        }
      : undefined,
  ].filter(Boolean);

  if (!isActionsAvailable) {
    return null;
  }

  return <ActionMenu id={archive.name} items={items} isCompact />;
}
