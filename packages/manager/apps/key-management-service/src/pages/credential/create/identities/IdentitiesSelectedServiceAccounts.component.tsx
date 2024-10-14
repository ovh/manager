import { DatagridColumn } from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES_URLS } from '@/routes/routes.constants';
import { useIdentityData } from '@/hooks/credential/useIdentityData';
import { IdentityOauthClient } from '@/types/identity.type';
import IdentitiesSelectedBase from './IdentitiesSelectedBase.component';
import IdentityServiceAccountDescriptionCell from './cell/service-account/IdentityServiceAccountDescriptionCell.component';
import IdentityServiceAccountNameCell from './cell/service-account/IdentityServiceAccountNameCell.component';
import IdentityServiceAccountDeleteActionCell from './cell/service-account/IdentityServiceAccountDeleteActionCell';

type IdentitiesSelectedServiceAccountsProps = {
  identityURNs: string[];
};

const IdentitiesSelectedServiceAccounts = ({
  identityURNs,
}: IdentitiesSelectedServiceAccountsProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const navigate = useNavigate();
  const { serviceAccountList, setServiceAccountList } = useIdentityData();

  const columns: DatagridColumn<IdentityOauthClient>[] = [
    {
      id: 'name',
      cell: IdentityServiceAccountNameCell,
      label: t('key_management_service_credential_user_list_column_name'),
      isSortable: false,
    },
    {
      id: 'description',
      cell: IdentityServiceAccountDescriptionCell,
      label: t(
        'key_management_service_credential_user_list_column_description',
      ),
      isSortable: false,
    },
    {
      id: 'action',
      cell: IdentityServiceAccountDeleteActionCell,
      label: '',
      isSortable: false,
    },
  ];
  return (
    <IdentitiesSelectedBase
      title={t(
        'key_management_service_credential_create_identities_service_accounts_title',
      )}
      addCallback={() =>
        navigate(ROUTES_URLS.createCredentialAddServiceAccountModal)
      }
      addButtonLabel={t(
        'key_management_service_credential_create_identities_service_accounts_button_add_label',
      )}
      deleteCallback={() => setServiceAccountList([])}
      datagridColumns={columns}
      items={serviceAccountList}
      identityURNs={identityURNs}
    ></IdentitiesSelectedBase>
  );
};

export default IdentitiesSelectedServiceAccounts;
