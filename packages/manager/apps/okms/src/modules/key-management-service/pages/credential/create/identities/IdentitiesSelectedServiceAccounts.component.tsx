import { useNavigate } from 'react-router-dom';

import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import { KMS_ROUTES_URIS } from '@key-management-service/routes/routes.constants';
import { IdentityOauthClient } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

import { DatagridColumn } from '@ovh-ux/manager-react-components';

import IdentitiesSelectedBase from './IdentitiesSelectedBase.component';
import IdentityServiceAccountDeleteActionCell from './cell/service-account/IdentityServiceAccountDeleteActionCell';
import IdentityServiceAccountIdentityCell from './cell/service-account/IdentityServiceAccountIdentityCell.component';
import IdentityServiceAccountNameCell from './cell/service-account/IdentityServiceAccountNameCell.component';

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
      id: 'identity',
      cell: IdentityServiceAccountIdentityCell,
      label: t(
        'key_management_service_credential_create_identities_service-account_tile_identity_label',
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
      title={t('key_management_service_credential_create_identities_service_accounts_title')}
      addCallback={() => navigate(KMS_ROUTES_URIS.credentialCreateAddServiceAccountModal)}
      addButtonLabel={t(
        'key_management_service_credential_create_identities_service_accounts_button_add_label',
      )}
      deleteCallback={() => setServiceAccountList([])}
      datagridColumns={columns}
      items={serviceAccountList}
      identityURNs={identityURNs}
    />
  );
};

export default IdentitiesSelectedServiceAccounts;
