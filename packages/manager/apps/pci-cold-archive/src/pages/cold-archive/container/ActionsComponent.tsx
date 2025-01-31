import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { TArchiveContainer } from '@/api/data/archive';
import { COLD_ARCHIVE_TRACKING } from '@/constants';
import { COLD_ARCHIVE_CONTAINER_STATUS } from './Status.components';

export default function ActionsComponent({
  archive,
}: Readonly<{
  archive: TArchiveContainer;
}>) {
  const { t } = useTranslation('cold-archive');
  const navigate = useNavigate();
  const { tracking } = useContext(ShellContext).shell;

  const isActionAddUserAvailable = () => {
    return [
      COLD_ARCHIVE_CONTAINER_STATUS.NONE,
      COLD_ARCHIVE_CONTAINER_STATUS.ARCHIVED,
      COLD_ARCHIVE_CONTAINER_STATUS.RESTORED,
    ].includes(archive.status);
  };

  const items = [
    isActionAddUserAvailable()
      ? {
          id: 0,
          label: t(
            'pci_projects_project_storages_cold_archive_container_action_add_user',
          ),
          onClick: () => {
            tracking?.trackClick({
              name: `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_USER}`,
              type: 'navigaton',
            });
            navigate(`./add-user/${archive.name}`);
          },
        }
      : undefined,
    {
      id: 2,
      label: t(
        'pci_projects_project_storages_cold_archive_container_action_delete_container',
      ),
      onClick: () => {
        tracking?.trackClick({
          name: `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.DELETE_CONTAINER}`,
          type: 'navigaton',
        });
        navigate(`./delete-container/${archive.name}`);
      },
    },
  ].filter(Boolean);

  return <ActionMenu id={archive.name} items={items} isCompact />;
}
