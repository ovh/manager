import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { TIndexedBackupConfiguration } from './useDatagridColumn';

export default function ActionsComponent({
  replication,
}: Readonly<{
  replication: TIndexedBackupConfiguration;
}>) {
  const { t } = useTranslation('containers/replication');

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const encodeName = (name: string) => btoa(encodeURIComponent(name));

  const items = [
    {
      id: 2,
      label: t(
        'pci_projects_project_storages_containers_replication_list_data_grid_action_delete',
      ),
      onClick: () => {
        navigate(
          `./${encodeName(replication.id)}/delete?region=${searchParams.get(
            'region',
          )}`,
        );
      },
    },
  ].filter(Boolean);

  return (
    <ActionMenu
      id={replication.index}
      items={items}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
    />
  );
}
