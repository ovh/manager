import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { TArchiveContainer } from '@/api/data/archive';

export default function ActionsComponent({
  archive,
}: Readonly<{
  archive: TArchiveContainer;
}>) {
  const { t } = useTranslation('cold-archive');
  const navigate = useNavigate();

  const items = [
    {
      id: 0,
      label: t(
        'pci_projects_project_storages_cold_archive_container_action_add_user',
      ),
      onClick: () => {
        navigate(`./add-user`);
      },
    },
    {
      id: 2,
      label: t(
        'pci_projects_project_storages_cold_archive_container_action_delete_container',
      ),
      onClick: () => {
        navigate(
          `./delete-container/${archive.name}
          }`,
        );
      },
    },
  ].filter(Boolean);

  return <ActionMenu id={archive.name} items={items} isCompact />;
}
