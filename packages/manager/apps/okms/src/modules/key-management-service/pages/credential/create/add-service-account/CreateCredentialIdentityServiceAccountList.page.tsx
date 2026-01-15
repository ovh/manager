import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useIdentityServiceAccountList } from '@key-management-service/data/hooks/useIdentity';
import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import IdentitiesServiceAccountList from '@key-management-service/pages/credential/create/identities/list/IdentitiesServiceAccountList.component';
import { IdentityOauthClient } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OdsModal, OdsSpinner } from '@ovhcloud/ods-components/react';
import { Text } from '@ovhcloud/ods-react';

import { Button } from '@ovh-ux/muk';

import '../CreateCommonModal.scss';

const CreateCredentialIdentityServiceAccountList = () => {
  const { t } = useTranslation('key-management-service/credential');
  const { combinedData, isLoading } = useIdentityServiceAccountList();
  const { serviceAccountList, setServiceAccountList } = useIdentityData();
  const [selectedServiceAccountList, setSelectedServiceAccountList] =
    useState<IdentityOauthClient[]>(serviceAccountList);
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
            <OdsSpinner size={ODS_SPINNER_SIZE.md} />
          </div>
        ) : (
          <IdentitiesServiceAccountList
            serviceAccountList={combinedData}
            selectedServiceAccounts={selectedServiceAccountList}
            setSelectedServiceAccounts={setSelectedServiceAccountList}
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
          setServiceAccountList(selectedServiceAccountList);
          closeModal();
        }}
      >
        {t('key_management_service_credentials_identity_modal_user_list_add')}
      </Button>
    </OdsModal>
  );
};

export default CreateCredentialIdentityServiceAccountList;
