import { createSearchParams, useHref } from 'react-router-dom';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { TStorage } from '@/api/data/storages';
import { OBJECT_CONTAINER_MODE_LOCAL_ZONE } from '@/constants';
import { isSwiftType } from '@/helpers';

export function Actions({ storage }: { storage: TStorage }) {
  const { t } = useTranslation('pci-storages-containers');
  const storageHref = useHref({
    pathname: `./${storage.name}`,
    search: `?${createSearchParams({
      region: storage.region,
    })}`,
  });
  const addUserHref = useHref({
    pathname: `./addUser`,
    search: `?${createSearchParams({
      containerId: storage.name,
    })}`,
  });
  const deleteHref = useHref({
    pathname: `./delete`,
    search: `?${createSearchParams({
      containerId: storage.name,
    })}`,
  });

  const items = [
    {
      href: addUserHref,
      label: t('pci_projects_project_storages_containers_view_add_user_label'),
      condition:
        storage.s3StorageType &&
        (!storage.deploymentMode ||
          storage.deploymentMode !== OBJECT_CONTAINER_MODE_LOCAL_ZONE),
    },
    {
      href: storageHref,
      label: t('pci_projects_project_storages_containers_view_object_label'),
    },
    {
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
      href: deleteHref,
      label: t('pci_projects_project_storages_containers_delete_label'),
    },
  ]
    .filter((i) => !('condition' in i) || i.condition)
    .map((i, index) => ({
      id: index,
      ...i,
    }));

  return <ActionMenu items={items} isCompact />;
}
