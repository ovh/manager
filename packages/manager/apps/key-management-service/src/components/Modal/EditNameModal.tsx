import {
  OsdsButton,
  OsdsInput,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_INPUT_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  OsdsInputCustomEvent,
  OdsInputValueChangeEventDetail,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { isValidOkmsName } from '@/utils';
import Modal from './Modal';
import { OKMS } from '@/types/okms.type';

interface DeleteModalProps {
  okms: OKMS;
  toggleModal: (showModal: boolean) => void;
  onEditName: (okms: OKMS) => void;
}

const EditNameModal = ({ okms, toggleModal, onEditName }: DeleteModalProps) => {
  const { t } = useTranslation('key-management-service/dashboard');
  const [newName, setNewName] = useState(okms.iam?.displayName || '');
  const isValidName = isValidOkmsName(newName);
  const isButtonValid = okms.iam?.displayName !== newName && isValidName;

  const onEdit = () => {
    if (isButtonValid) {
      onEditName({
        ...okms,
        iam: {
          ...okms.iam,
          displayName: newName,
        },
      } as OKMS);
      toggleModal(false);
    }
  };
  return (
    <Modal
      color={ODS_THEME_COLOR_INTENT.info}
      onClose={() => toggleModal(false)}
    >
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._400}
        className="my-4"
      >
        {t('key_management_service_dashboard_modal_title')}
      </OsdsText>
      <OsdsInput
        aria-label="edit-input"
        type={ODS_INPUT_TYPE.text}
        color={
          isValidName
            ? ODS_THEME_COLOR_INTENT.info
            : ODS_THEME_COLOR_INTENT.error
        }
        className="p-3"
        value={newName}
        onOdsValueChange={(
          e: OsdsInputCustomEvent<OdsInputValueChangeEventDetail>,
        ) => setNewName(e.target.value as string)}
      />
      <OsdsButton
        slot="actions"
        variant={ODS_BUTTON_VARIANT.stroked}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => {
          toggleModal(false);
        }}
      >
        {t('key_management_service_dashboard_modal_cta_cancel')}
      </OsdsButton>
      <OsdsButton
        disabled={!isButtonValid || undefined}
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onEdit}
        aria-label="edit-name-okms"
      >
        {t('key_management_service_dashboard_modal_cta_edit')}
      </OsdsButton>
    </Modal>
  );
};

export default EditNameModal;
