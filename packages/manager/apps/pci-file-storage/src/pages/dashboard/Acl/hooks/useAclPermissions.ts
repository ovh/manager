import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { TPermissionOption, permissionOptions } from '@/pages/dashboard/Acl/acl.view-model';

export const useAclPermissions = () => {
  const { t } = useTranslation(['acl']);

  const permissionsMap = useMemo(
    () =>
      permissionOptions.reduce(
        (map, option) => ({
          ...map,
          [option]: t(`acl:columns.accessPermission.${option}`),
        }),
        {} as Record<TPermissionOption, string>,
      ),
    [t],
  );

  const permissions = useMemo(
    () =>
      permissionOptions.map((option) => ({
        value: option,
        label: t(`acl:columns.accessPermission.${option}`),
      })),
    [t],
  );

  return { permissionsMap, permissions };
};
