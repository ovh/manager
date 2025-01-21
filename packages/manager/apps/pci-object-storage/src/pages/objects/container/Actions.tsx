import { createSearchParams, useParams, useNavigate } from 'react-router-dom';
import { ActionMenu, useNotifications } from '@ovh-ux/manager-react-components';
import { Translation, useTranslation } from 'react-i18next';
import { v4 as uuidV4 } from 'uuid';
import { ApiError } from '@ovh-ux/manager-core-api';

import { TStorage } from '@/api/data/storages';
import { OBJECT_CONTAINER_MODE_LOCAL_ZONE } from '@/constants';
import { isSwiftType } from '@/helpers';
import { useUpdateStorageType } from '@/api/hooks/useStorages';

export function Actions({ storage }: Readonly<{ storage: TStorage }>) {
  const { t } = useTranslation('containers');

  const navigate = useNavigate();
  const { projectId } = useParams();
  const { addSuccess, addError } = useNotifications();

  const { isPending, updateStorageType } = useUpdateStorageType({
    projectId,
    onSuccess() {
      addSuccess(
        <Translation ns="containers">
          {(_t) =>
            _t(
              storage.containerType === 'public'
                ? 'pci_projects_project_storages_containers_toggle_private_succeed'
                : 'pci_projects_project_storages_containers_toggle_public_succeed',
              {
                name: storage.name,
              },
            )
          }
        </Translation>,
        true,
      );
    },
    onError(error: ApiError) {
      addError(
        <Translation ns="containers">
          {(_t) =>
            _t('pci_projects_project_storages_containers_toggle_fail', {
              message: error?.response?.data?.message || error?.message || null,
            })
          }
        </Translation>,
        true,
      );
    },
  });

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
        updateStorageType(
          storage.id,
          storage.containerType === 'public' ? 'private' : 'public',
        );
      },
      label: t(
        storage.containerType === 'public'
          ? 'pci_projects_project_storages_containers_switch_to_private_label'
          : 'pci_projects_project_storages_containers_switch_to_public_label',
      ),
      condition: isSwiftType(storage),
      disabled: isPending,
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
