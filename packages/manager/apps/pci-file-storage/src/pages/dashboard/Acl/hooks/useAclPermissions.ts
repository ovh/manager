import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { permissionOptions } from '@/pages/dashboard/Acl/acl.view-model';

export const useAclPermissions = () => {
  const { t } = useTranslation(['acl']);

  const permissions = useMemo(
    () =>
      permissionOptions.map((option) => ({
        value: option,
        label: t(`acl:columns.accessPermission.${option}`),
      })),
    [t],
  );

  return { permissions };
};
