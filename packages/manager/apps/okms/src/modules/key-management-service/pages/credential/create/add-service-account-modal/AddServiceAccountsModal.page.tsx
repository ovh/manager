import { IdentitiesServiceAccountList } from '@key-management-service/components/credential/create-step-identities/list/IdentitiesServiceAccountList.component';
import { IdentitiesSelectionModal } from '@key-management-service/components/credential/create-step-identities/modal/IdentitiesSelectionModal.component';
import { useIdentityServiceAccountList } from '@key-management-service/data/hooks/useIdentity';
import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import {
  IdentityOauthClient,
  IdentityOauthClientFlow,
} from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

const AddServiceAccountsModal = () => {
  const { t } = useTranslation('key-management-service/credential');
  const { combinedData, isLoading } = useIdentityServiceAccountList();
  const { serviceAccountList, setServiceAccountList } = useIdentityData();

  const filteredData = combinedData.filter(
    (serviceAccount) => serviceAccount.flow === IdentityOauthClientFlow.client_credentials,
  );

  return (
    <IdentitiesSelectionModal<IdentityOauthClient>
      title={t('key_management_service_credentials_identity_modal_service_account_headline')}
      isLoading={isLoading}
      initialSelected={serviceAccountList}
      onSave={setServiceAccountList}
    >
      {(selectedServiceAccountList, setSelectedServiceAccountList) => (
        <IdentitiesServiceAccountList
          items={filteredData}
          selectedItems={selectedServiceAccountList}
          setSelectedItems={setSelectedServiceAccountList}
        />
      )}
    </IdentitiesSelectionModal>
  );
};

export default AddServiceAccountsModal;
