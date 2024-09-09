import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Datagrid,
  DatagridColumn,
  DataGridTextCell,
  Subtitle,
} from '@ovh-ux/manager-react-components';
import { IdentityObject } from '@/types/identity.type';

interface IOVHAccounts {
  identities: IdentityObject[];
}

const OVHAccounts = ({ identities }: IOVHAccounts) => {
  const { t } = useTranslation('key-management-service/credential');

  const columns: DatagridColumn<IdentityObject>[] = [
    {
      id: 'Account',
      label: t(
        'key_management_service_credential_identities_account_column_account',
      ),
      cell: (identity) => (
        <DataGridTextCell>{identity.account}</DataGridTextCell>
      ),
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
        {t('key_management_service_credential_identities_account_title')}
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

export default OVHAccounts;
