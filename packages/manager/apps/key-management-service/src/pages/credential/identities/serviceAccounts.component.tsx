import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Datagrid,
  DatagridColumn,
  Subtitle,
} from '@ovh-ux/manager-react-components';
import { IdentityObject } from '@/types/identity.type';
import { IdentityIdCell, IdentityUrnCell } from './cell/identityCell.component';

interface IServiceAccounts {
  identities: IdentityObject[];
}

const ServiceAccounts = ({ identities }: IServiceAccounts) => {
  const { t } = useTranslation('key-management-service/credential');

  const columns: DatagridColumn<IdentityObject>[] = [
    {
      id: 'id',
      label: t(
        'key_management_service_credential_identities_service_account_column_id',
      ),
      cell: IdentityIdCell,
    },
    {
      id: 'urn',
      label: t('key_management_service_credential_identities_column_urn'),
      cell: IdentityUrnCell,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Subtitle>
        {t(
          'key_management_service_credential_identities_service_account_title',
        )}
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

export default ServiceAccounts;
