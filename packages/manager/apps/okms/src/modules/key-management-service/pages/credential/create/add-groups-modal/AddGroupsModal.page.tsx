import { IdentitiesGroupList } from '@key-management-service/components/credential/create-step-identities/list/IdentitiesGroupList.component';
import { IdentitiesSelectionModal } from '@key-management-service/components/credential/create-step-identities/modal/IdentitiesSelectionModal.component';
import { useIdentityGroupList } from '@key-management-service/data/hooks/useIdentity';
import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import { IdentityGroup } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

const AddGroupsModal = () => {
  const { combinedData, isLoading } = useIdentityGroupList();
  const { groupList, setGroupList } = useIdentityData();
  const { t } = useTranslation('key-management-service/credential');

  return (
    <IdentitiesSelectionModal<IdentityGroup>
      title={t('key_management_service_credentials_identity_modal_group_list_headline')}
      isLoading={isLoading}
      initialSelected={groupList}
      onSave={setGroupList}
    >
      {(selectedGroupList, setSelectedGroupList) => (
        <IdentitiesGroupList
          items={combinedData}
          selectedItems={selectedGroupList}
          setSelectedItems={setSelectedGroupList}
        />
      )}
    </IdentitiesSelectionModal>
  );
};

export default AddGroupsModal;
