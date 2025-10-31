import React, { useState } from 'react';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { useNavigate } from 'react-router-dom';
import {
  OdsButton,
  OdsModal,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import IdentitiesGroupList from '@key-management-service/pages/credential/create/identities/list/IdentitiesGroupList.component';
import { useIdentityGroupList } from '@key-management-service/data/hooks/useIdentity';
import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import { IdentityGroup } from '@key-management-service/types/identity.type';
import '../CreateCommonModal.scss';

const CreateCredentialIdentityGroupList = () => {
  const { t } = useTranslation('key-management-service/credential');
  const { combinedData, isLoading } = useIdentityGroupList();
  const { groupList, setGroupList } = useIdentityData();
  const [selectedGroupList, setSelectedGroupList] = useState<IdentityGroup[]>(
    groupList,
  );
  const navigate = useNavigate();

  const closeModal = () => navigate('..');

  return (
    <OdsModal
      isOpen
      isDismissible
      onOdsClose={closeModal}
      className="ods-identity-modal"
    >
      <OdsText preset={ODS_TEXT_PRESET.heading3}>
        {t(
          'key_management_service_credentials_identity_modal_group_list_headline',
        )}
      </OdsText>
      <div className="mt-4 max-h-[400px] h-full overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center">
            <OdsSpinner size={ODS_SPINNER_SIZE.md} />
          </div>
        ) : (
          <IdentitiesGroupList
            groupList={combinedData}
            selectedGroupList={selectedGroupList}
            setSelectedGroupList={setSelectedGroupList}
          />
        )}
      </div>
      <OdsButton
        slot="actions"
        type="button"
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_BUTTON_COLOR.primary}
        onClick={closeModal}
        label={t(
          'key_management_service_credentials_identity_modal_group_list_cancel',
        )}
      />
      <OdsButton
        isLoading={isLoading}
        slot="actions"
        type="button"
        color={ODS_BUTTON_COLOR.primary}
        onClick={() => {
          setGroupList(selectedGroupList);
          closeModal();
        }}
        label={t(
          'key_management_service_credentials_identity_modal_group_list_add',
        )}
      />
    </OdsModal>
  );
};

export default CreateCredentialIdentityGroupList;
