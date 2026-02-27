import { useNavigate } from 'react-router-dom';

import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import { KMS_ROUTES_URIS } from '@key-management-service/routes/routes.constants';
import { IdentityOauthClient } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { DatagridColumn } from '@ovh-ux/manager-react-components';

import { IdentitySelectionBase } from '../base/IdentitySelectionBase.component';
import { RemoveIdentityButton } from '../base/RemoveIdentityButton.component';
import { IDENTITY_SELECTION_SERVICE_ACCOUNTS_TEST_IDS } from './IdentitiesSelectedListServiceAccounts.constants';

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
        (serviceAccountInList) => serviceAccountInList.clientId !== serviceAccount.identity,
      ),
    );
  };

  const columns: DatagridColumn<IdentityOauthClient>[] = [
    {
      id: 'name',
      cell: (serviceAccount: IdentityOauthClient) => (
        <Text
          preset="span"
          data-testid={IDENTITY_SELECTION_SERVICE_ACCOUNTS_TEST_IDS.name(serviceAccount.identity)}
        >
          {serviceAccount.name}
        </Text>
      ),
      label: t('key_management_service_credential_user_list_column_name'),
    },
    {
      id: 'identity',
      cell: (serviceAccount: IdentityOauthClient) => (
        <Text
          preset="span"
          data-testid={IDENTITY_SELECTION_SERVICE_ACCOUNTS_TEST_IDS.identity(
            serviceAccount.identity,
          )}
        >
          {serviceAccount.identity}
        </Text>
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
          testId={IDENTITY_SELECTION_SERVICE_ACCOUNTS_TEST_IDS.removeButton(
            serviceAccount.identity,
          )}
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
      addButtonTestId={IDENTITY_SELECTION_SERVICE_ACCOUNTS_TEST_IDS.addButton}
      deleteCallback={() => setServiceAccountList([])}
      deleteButtonTestId={IDENTITY_SELECTION_SERVICE_ACCOUNTS_TEST_IDS.deleteButton}
      datagridColumns={columns}
      items={serviceAccountList}
      identityURNs={identityURNs}
    />
  );
};
