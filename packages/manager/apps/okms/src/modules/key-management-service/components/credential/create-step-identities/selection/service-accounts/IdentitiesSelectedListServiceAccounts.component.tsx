import { useNavigate } from 'react-router-dom';

import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import { KMS_ROUTES_URIS } from '@key-management-service/routes/routes.constants';
import { IdentityOauthClient } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

import { DataGridTextCell, DatagridColumn } from '@ovh-ux/manager-react-components';

import { IdentitySelectionBase } from '../base/IdentitySelectionBase.component';
import { RemoveIdentityButton } from '../base/RemoveIdentityButton.component';

type IdentitySelectionServiceAccountsProps = {
  identityURNs: string[];
};

export const IdentitySelectionServiceAccounts = ({
  identityURNs,
}: IdentitySelectionServiceAccountsProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const navigate = useNavigate();
  const { serviceAccountList, setServiceAccountList } = useIdentityData();

  const handleRemoveServiceAccount = (serviceAccount: IdentityOauthClient) => {
    setServiceAccountList((prevServiceAccountList) =>
      prevServiceAccountList.filter(
        (serviceAccountInList) => serviceAccountInList.clientId !== serviceAccount.clientId,
      ),
    );
  };

  const columns: DatagridColumn<IdentityOauthClient>[] = [
    {
      id: 'name',
      cell: (serviceAccount: IdentityOauthClient) => (
        <DataGridTextCell>{serviceAccount.name}</DataGridTextCell>
      ),
      label: t('key_management_service_credential_user_list_column_name'),
    },
    {
      id: 'identity',
      cell: (serviceAccount: IdentityOauthClient) => (
        <DataGridTextCell>{serviceAccount.identity || ''}</DataGridTextCell>
      ),
      label: t(
        'key_management_service_credential_create_identities_service-account_tile_identity_label',
      ),
    },
    {
      id: 'action',
      cell: (serviceAccount: IdentityOauthClient) => (
        <RemoveIdentityButton
          onClick={() => handleRemoveServiceAccount(serviceAccount)}
          testId={`remove-service-account-button-${serviceAccount.clientId}`}
        />
      ),
      label: '',
    },
  ];
  return (
    <IdentitySelectionBase
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
