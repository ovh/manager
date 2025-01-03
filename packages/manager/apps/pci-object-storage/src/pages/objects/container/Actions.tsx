import { createSearchParams, useHref, useNavigate } from 'react-router-dom';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { v4 as uuidV4 } from 'uuid';
import { TStorage } from '@/api/data/storages';
import { OBJECT_CONTAINER_MODE_LOCAL_ZONE } from '@/constants';
import { isSwiftType } from '@/helpers';

export function Actions({ storage }: { storage: TStorage }) {
  const { t } = useTranslation('pci-storages-containers');

  const navigate = useNavigate();

  const items = [
    {
      id: 0,
      label: t('pci_projects_project_storages_containers_view_add_user_label'),
      onClick: () =>
        navigate({
          pathname: `./addUser`,
          search: `?${createSearchParams({
            containerId: storage.name,
          })}`,
        }),
      condition:
        storage.s3StorageType &&
        (!storage.deploymentMode ||
          storage.deploymentMode !== OBJECT_CONTAINER_MODE_LOCAL_ZONE),
    },
    {
      id: 1,
      label: t('pci_projects_project_storages_containers_view_object_label'),
      onClick: () =>
        navigate({
          pathname: `./${storage.name}`,
          search: `?${createSearchParams({
            region: storage.region,
          })}`,
        }),
    },
    {
      id: 2,
      onClick: () => {
        // @TODO implement public toggle action
      },
      label: t(
        storage.state
          ? 'pci_projects_project_storages_containers_switch_to_private_label'
          : 'pci_projects_project_storages_containers_switch_to_public_label',
      ),
      condition: isSwiftType(storage),
    },
    {
      id: 3,
      label: t('pci_projects_project_storages_containers_delete_label'),
      onClick: () =>
        navigate({
          pathname: `./delete`,
          search: `?${createSearchParams({
            containerId: storage.name,
          })}`,
        }),
    },
  ]
    .filter((i) => !('condition' in i) || i.condition)
    .map((i, index) => ({
      id: index,
      ...i,
    }));

  return <ActionMenu id={uuidV4()} items={items} isCompact />;
}
