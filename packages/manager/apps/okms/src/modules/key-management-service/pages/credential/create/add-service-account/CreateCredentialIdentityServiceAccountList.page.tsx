import { useIdentityServiceAccountList } from '@key-management-service/data/hooks/useIdentity';
import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import IdentitiesServiceAccountList from '@key-management-service/pages/credential/create/identities/list/IdentitiesServiceAccountList.component';
import IdentitiesSelectionModal from '@key-management-service/pages/credential/create/identities/modal/IdentitiesSelectionModal.component';
import { IdentityOauthClient } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

const CreateCredentialIdentityServiceAccountList = () => {
  const { t } = useTranslation('key-management-service/credential');
  const { combinedData, isLoading } = useIdentityServiceAccountList();
  const { serviceAccountList, setServiceAccountList } = useIdentityData();

  return (
    <IdentitiesSelectionModal<IdentityOauthClient>
      title={t('key_management_service_credentials_identity_modal_user_list_headline')}
      isLoading={isLoading}
      initialSelected={serviceAccountList}
      onSave={setServiceAccountList}
    >
      {(selectedServiceAccountList, setSelectedServiceAccountList) => (
        <IdentitiesServiceAccountList
          serviceAccountList={combinedData}
          selectedServiceAccounts={selectedServiceAccountList}
          setSelectedServiceAccounts={setSelectedServiceAccountList}
        />
      )}
    </IdentitiesSelectionModal>
  );
};

export default CreateCredentialIdentityServiceAccountList;
