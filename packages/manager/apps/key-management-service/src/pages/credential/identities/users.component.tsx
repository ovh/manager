import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Datagrid,
  DatagridColumn,
  DataGridTextCell,
  Subtitle,
} from '@ovh-ux/manager-react-components';
import { IdentityObject } from '@/types/identity.type';

interface IUsers {
  identities: IdentityObject[];
}

const Users = ({ identities }: IUsers) => {
  const { t } = useTranslation('key-management-service/credential');

  const columns: DatagridColumn<IdentityObject>[] = [
    {
      id: 'id',
      label: t('key_management_service_credential_identities_user_column_id'),
      cell: (identity) => <DataGridTextCell>{identity.id}</DataGridTextCell>,
    },
    {
      id: 'urn',
      label: t('key_management_service_credential_identities_column_urn'),
      cell: (identity) => <DataGridTextCell>{identity.urn}</DataGridTextCell>,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Subtitle>
        {t('key_management_service_credential_identities_user_title')}
      </Subtitle>
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
