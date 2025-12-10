import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useIdentityUserList } from '@key-management-service/data/hooks/useIdentity';
import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import IdentitiesUserList from '@key-management-service/pages/credential/create/identities/list/IdentitiesUserList.component';
import { IdentityUser } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsModal, OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';

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
      <OdsText preset={ODS_TEXT_PRESET.heading3}>
        {t('key_management_service_credentials_identity_modal_user_list_headline')}
      </OdsText>
      <div className="mt-4 h-full max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center">
            <OdsSpinner size={ODS_SPINNER_SIZE.md} />
          </div>
        ) : (
          <IdentitiesUserList
            userList={combinedData}
            selectedUserList={selectedUserList}
            setSelectedUserList={setSelectedUserList}
          />
        )}
      </div>
      <OdsButton
        slot="actions"
        type="button"
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_BUTTON_COLOR.primary}
        onClick={closeModal}
        label={t('key_management_service_credentials_identity_modal_user_list_cancel')}
      />
      <OdsButton
        isLoading={isLoading}
        slot="actions"
        type="button"
        color={ODS_BUTTON_COLOR.primary}
        onClick={() => {
          setUserList(selectedUserList);
          closeModal();
        }}
        label={t('key_management_service_credentials_identity_modal_user_list_add')}
      />
    </OdsModal>
  );
};

export default CreateCredentialIdentityUserList;
