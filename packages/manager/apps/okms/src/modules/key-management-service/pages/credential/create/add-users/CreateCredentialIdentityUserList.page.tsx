import { useIdentityUserList } from '@key-management-service/data/hooks/useIdentity';
import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import IdentitiesUserList from '@key-management-service/pages/credential/create/identities/list/IdentitiesUserList.component';
import IdentitiesSelectionModal from '@key-management-service/pages/credential/create/identities/modal/IdentitiesSelectionModal.component';
import { IdentityUser } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

const CreateCredentialIdentityUserList = () => {
  const { t } = useTranslation('key-management-service/credential');
  const { combinedData, isLoading } = useIdentityUserList();
  const { userList, setUserList } = useIdentityData();

  return (
    <IdentitiesSelectionModal<IdentityUser>
      title={t('key_management_service_credentials_identity_modal_user_list_headline')}
      isLoading={isLoading}
      initialSelected={userList}
      onSave={setUserList}
    >
      {(selectedUserList, setSelectedUserList) => (
        <IdentitiesUserList
          userList={combinedData}
          selectedUserList={selectedUserList}
          setSelectedUserList={setSelectedUserList}
        />
      )}
    </IdentitiesSelectionModal>
  );
};

export default CreateCredentialIdentityUserList;
