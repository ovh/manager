import { useIdentityGroupList } from '@key-management-service/data/hooks/useIdentity';
import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import IdentitiesGroupList from '@key-management-service/pages/credential/create/identities/list/IdentitiesGroupList.component';
import IdentitiesSelectionModal from '@key-management-service/pages/credential/create/identities/modal/IdentitiesSelectionModal.component';
import { IdentityGroup } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

const CreateCredentialIdentityGroupList = () => {
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
          groupList={combinedData}
          selectedGroupList={selectedGroupList}
          setSelectedGroupList={setSelectedGroupList}
        />
      )}
    </IdentitiesSelectionModal>
  );
};

export default CreateCredentialIdentityGroupList;
