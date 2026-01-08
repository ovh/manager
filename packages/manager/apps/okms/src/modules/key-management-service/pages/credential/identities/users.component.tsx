import { IdentityObject } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { Datagrid, DatagridColumn } from '@ovh-ux/manager-react-components';

import { IdentityIdCell, IdentityUrnCell } from './cell/identityCell.component';

interface IUsers {
  identities: IdentityObject[];
}

const Users = ({ identities }: IUsers) => {
  const { t } = useTranslation('key-management-service/credential');

  const columns: DatagridColumn<IdentityObject>[] = [
    {
      id: 'id',
      label: t('key_management_service_credential_identities_user_column_id'),
      cell: IdentityIdCell,
    },
    {
      id: 'urn',
      label: t('key_management_service_credential_identities_column_urn'),
      cell: IdentityUrnCell,
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <Text preset="heading-3">{t('key_management_service_credential_identities_user_title')}</Text>
      <Datagrid
        columns={columns}
        items={identities || []}
        totalItems={identities.length}
        contentAlignLeft
      />
    </div>
  );
};

export default Users;
