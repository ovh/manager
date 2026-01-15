import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useIdentityUserList } from '@key-management-service/data/hooks/useIdentity';
import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import IdentitiesUserList from '@key-management-service/pages/credential/create/identities/list/IdentitiesUserList.component';
import { IdentityUser } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

import { OdsModal } from '@ovhcloud/ods-components/react';
import { Spinner, Text } from '@ovhcloud/ods-react';

import { Button } from '@ovh-ux/muk';

import '../CreateCommonModal.scss';

const CreateCredentialIdentityUserList = () => {
  const { t } = useTranslation('key-management-service/credential');
  const { combinedData, isLoading } = useIdentityUserList();
  const { userList, setUserList } = useIdentityData();
  const [selectedUserList, setSelectedUserList] = useState<IdentityUser[]>(userList);
  const navigate = useNavigate();

  const closeModal = () => navigate('..');

  return (
    <OdsModal isOpen isDismissible onOdsClose={closeModal} className="ods-identity-modal">
      <Text preset="heading-3">
        {t('key_management_service_credentials_identity_modal_user_list_headline')}
      </Text>
      <div className="mt-4 h-full max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <IdentitiesUserList
            userList={combinedData}
            selectedUserList={selectedUserList}
            setSelectedUserList={setSelectedUserList}
          />
        )}
      </div>
      <Button slot="actions" type="button" variant="ghost" color="primary" onClick={closeModal}>
        {t('key_management_service_credentials_identity_modal_user_list_cancel')}
      </Button>
      <Button
        loading={isLoading}
        slot="actions"
        type="button"
        color="primary"
        onClick={() => {
          setUserList(selectedUserList);
          closeModal();
        }}
      >
        {t('key_management_service_credentials_identity_modal_user_list_add')}
      </Button>
    </OdsModal>
  );
};

export default CreateCredentialIdentityUserList;
