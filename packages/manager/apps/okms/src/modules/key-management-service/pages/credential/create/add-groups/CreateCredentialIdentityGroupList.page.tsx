import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useIdentityGroupList } from '@key-management-service/data/hooks/useIdentity';
import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import IdentitiesGroupList from '@key-management-service/pages/credential/create/identities/list/IdentitiesGroupList.component';
import { IdentityGroup } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

import { ODS_SPINNER_SIZE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsModal, OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';

import { Button } from '@ovh-ux/muk';

import '../CreateCommonModal.scss';

const CreateCredentialIdentityGroupList = () => {
  const { t } = useTranslation('key-management-service/credential');
  const { combinedData, isLoading } = useIdentityGroupList();
  const { groupList, setGroupList } = useIdentityData();
  const [selectedGroupList, setSelectedGroupList] = useState<IdentityGroup[]>(groupList);
  const navigate = useNavigate();

  const closeModal = () => navigate('..');

  return (
    <OdsModal isOpen isDismissible onOdsClose={closeModal} className="ods-identity-modal">
      <OdsText preset={ODS_TEXT_PRESET.heading3}>
        {t('key_management_service_credentials_identity_modal_group_list_headline')}
      </OdsText>
      <div className="mt-4 h-full max-h-[400px] overflow-y-auto">
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
      <Button slot="actions" type="button" variant="ghost" color="primary" onClick={closeModal}>
        {t('key_management_service_credentials_identity_modal_group_list_cancel')}
      </Button>
      <Button
        loading={isLoading}
        slot="actions"
        type="button"
        color="primary"
        onClick={() => {
          setGroupList(selectedGroupList);
          closeModal();
        }}
      >
        {t('key_management_service_credentials_identity_modal_group_list_add')}
      </Button>
    </OdsModal>
  );
};

export default CreateCredentialIdentityGroupList;
