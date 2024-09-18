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
import { IdentityGroup } from '@/types/identity.type';
import { useIdentityData } from '@/hooks/credential/useIdentityData';
import { useIdentityGroupList } from '@/data/hooks/useIdentity';
import IdentitiesGroupList from '@/pages/credential/create/identities/list/IdentitiesGroupList.component';

type IdentityGroupListModalProps = {
  closeModal: () => void;
};

const IdentityGroupListModal = ({
  closeModal,
}: IdentityGroupListModalProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const { combinedData, isLoading } = useIdentityGroupList();
  const { groupList, setGroupList } = useIdentityData();
  const [selectedGroupList, setSelectedGroupList] = useState<IdentityGroup[]>(
    groupList,
  );

  const close = () => {
    closeModal();
  };

  return (
    <OsdsModal
      dismissible
      color={ODS_THEME_COLOR_INTENT.primary}
      headline={t(
        'key_management_service_credentials_identity_modal_group_list_headline',
      )}
      onOdsModalClose={close}
    >
      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center">
            <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
          </div>
        ) : (
          <IdentitiesGroupList
            groupList={combinedData}
            selectedGroupList={selectedGroupList}
            setSelectedGroupList={setSelectedGroupList}
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
          'key_management_service_credentials_identity_modal_group_list_cancel',
        )}
      </OsdsButton>
      <OsdsButton
        disabled={isLoading || undefined}
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => {
          setGroupList(selectedGroupList);
          close();
        }}
      >
        {t('key_management_service_credentials_identity_modal_group_list_add')}
      </OsdsButton>
    </OsdsModal>
  );
};

export default IdentityGroupListModal;
