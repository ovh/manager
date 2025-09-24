import { createSearchParams, useParams, useNavigate } from 'react-router-dom';
import { ActionMenu, useNotifications } from '@ovh-ux/manager-react-components';
import { Translation, useTranslation } from 'react-i18next';
import { ApiError } from '@ovh-ux/manager-core-api';

import { useMemo } from 'react';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { TStorage } from '@/api/data/storages';
import { OBJECT_CONTAINER_MODE_LOCAL_ZONE } from '@/constants';
import { isSwiftType } from '@/helpers';
import { useUpdateStorageType } from '@/api/hooks/useStorages';

const PUBLIC_STORAGE_TYPES = ['public', 'static'];

export function Actions({
  storage,
  isEmptyUsers,
}: Readonly<{ storage: TStorage; isEmptyUsers: boolean }>) {
  const { t } = useTranslation('containers');

  const navigate = useNavigate();
  const { projectId } = useParams();
  const { addSuccess, addError, clearNotifications } = useNotifications();

  const { isPending, updateStorageType } = useUpdateStorageType({
    projectId,
    onSuccess: (containerType) => {
      addSuccess(
        <Translation ns="containers">
          {(_t) =>
            _t(
              `pci_projects_project_storages_containers_toggle_${containerType}_succeed`,
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

  const uid = useMemo(
    () =>
      `${storage.name}-${storage.deploymentMode}-${storage.region}${
        storage.s3StorageType ? '-s3' : ''
      }`.replace(/\./g, '-'),
    [storage],
  );

  const items = [
    {
      id: 0,
      label: t('pci_projects_project_storages_containers_view_dashboard_label'),
      onClick: () =>
        navigate({
          pathname: `./dashboard/${storage.id || storage.name}`,
          search: `?${createSearchParams({
            region: storage.region,
          })}`,
        }),
    },
    {
      id: 1,
      label: t('pci_projects_project_storages_containers_view_add_user_label'),
      onClick: () =>
        isEmptyUsers
          ? navigate('./emptyUser')
          : navigate({
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
      id: 2,
      onClick: () => {
        clearNotifications();
        updateStorageType(
          storage.id,
          PUBLIC_STORAGE_TYPES.includes(storage.containerType)
            ? 'private'
            : 'public',
        );
      },
      label: t(
        PUBLIC_STORAGE_TYPES.includes(storage.containerType)
          ? 'pci_projects_project_storages_containers_switch_to_private_label'
          : 'pci_projects_project_storages_containers_switch_to_public_label',
      ),
      condition: isSwiftType(storage),
      isDisabled: isPending,
    },
    {
      id: 3,
      label: t('pci_projects_project_storages_containers_delete_label'),
      onClick: () => {
        const searchParams = {
          containerId: storage.name,
          region: storage.region,
          ...(storage.containerType && {
            containerType: storage.containerType,
          }),
        };
        navigate({
          pathname: `./delete`,
          search: `?${createSearchParams(searchParams)}`,
        });
      },
    },
  ]
    .filter((i) => !('condition' in i) || i.condition)
    .map((i, index) => ({
      id: index,
      ...i,
    }));

  return (
    <ActionMenu
      id={uid}
      items={items}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
    />
  );
}
