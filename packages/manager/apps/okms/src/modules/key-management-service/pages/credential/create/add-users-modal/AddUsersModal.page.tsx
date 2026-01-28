import { IdentitiesUserList } from '@key-management-service/components/credential/create-step-identities/list/IdentitiesUserList.component';
import { IdentitiesSelectionModal } from '@key-management-service/components/credential/create-step-identities/modal/IdentitiesSelectionModal.component';
import { useIdentityUserList } from '@key-management-service/data/hooks/useIdentity';
import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import { IdentityUser } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

const AddUsersModal = () => {
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
          items={combinedData}
          selectedItems={selectedUserList}
          setSelectedItems={setSelectedUserList}
        />
      )}
    </IdentitiesSelectionModal>
  );
};

export default AddUsersModal;
