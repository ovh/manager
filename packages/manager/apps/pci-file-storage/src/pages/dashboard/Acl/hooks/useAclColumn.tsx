import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { DatagridColumn } from '@ovh-ux/muk';

export const useAclColumn = (): DatagridColumn<Record<string, unknown>>[] => {
  const { t } = useTranslation(['acl', NAMESPACES.ACTIONS]);
  return useMemo(() => {
    return [
      {
        id: 'accessTo',
        accessorKey: 'accessTo',
        header: t('acl:columns.accessTo.header'),
      },
      {
        id: 'accessPermission',
        accessorKey: 'permission',
        header: t('acl:columns.accessPermission.header'),
      },
      {
        id: 'action',
        header: t('acl:columns.actions.header'),
      },
    ];
  }, [t]);
};
