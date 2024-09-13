import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsModal,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IdentityOauthClient } from '@/types/identity.type';
import { useIdentityData } from '@/hooks/credential/useIdentityData';
import { useIdentityServiceAccountList } from '@/data/hooks/useIdentity';
import IdentitiesServiceAccountList from '@/components/credential/create/identities/list/IdentitiesServiceAccountList.component';

type IdentityServiceAccountListModalProps = {
  closeModal: () => void;
};

const IdentityServiceAccountListModal = ({
  closeModal,
}: IdentityServiceAccountListModalProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const { combinedData, isLoading } = useIdentityServiceAccountList();
  const { serviceAccountList, setServiceAccountList } = useIdentityData();
  const [selectedServiceAccountList, setSelectedServiceAccountList] = useState<
    IdentityOauthClient[]
  >(serviceAccountList);

  const close = () => {
    closeModal();
  };

  return (
    <OsdsModal
      dismissible
      color={ODS_THEME_COLOR_INTENT.primary}
      headline={t(
        'key_management_service_credentials_identity_modal_user_list_headline',
      )}
      onOdsModalClose={close}
    >
      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center">
            <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
          </div>
        ) : (
          <IdentitiesServiceAccountList
            serviceAccountList={combinedData}
            selectedServiceAccounts={selectedServiceAccountList}
            setSelectedServiceAccounts={setSelectedServiceAccountList}
          />
        )}
      </div>
      <OsdsButton
        disabled={isLoading || undefined}
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={close}
      >
        {t(
          'key_management_service_credentials_identity_modal_user_list_cancel',
        )}
      </OsdsButton>
      <OsdsButton
        disabled={isLoading || undefined}
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => {
          setServiceAccountList(selectedServiceAccountList);
          close();
        }}
      >
        {t('key_management_service_credentials_identity_modal_user_list_add')}
      </OsdsButton>
    </OsdsModal>
  );
};

export default IdentityServiceAccountListModal;
