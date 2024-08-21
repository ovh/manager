import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  OdsInputValueChangeEventDetail,
  OsdsInputCustomEvent,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsModal,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface EditModalProps {
  organizationName: string;
  onCloseModal: () => void;
  onEdit: (name: string) => void;
}

const validateName = (name: string) => /^.{1,128}$/.test(name);

export const EditNameModal = ({
  organizationName,
  onCloseModal,
  onEdit,
}: EditModalProps) => {
  const { t } = useTranslation('dashboard');
  const [newName, setNewName] = useState<string>(organizationName || '');
  const isValidName = validateName(newName);
  const isButtonEnabled = isValidName && newName !== organizationName;

  const handleSubmit = () => {
    if (isValidName) {
      onEdit(newName);
      onCloseModal();
    }
  };

  return (
    <OsdsModal
      color={ODS_THEME_COLOR_INTENT.info}
      onOdsModalClose={onCloseModal}
      dismissible
      headline={t('managed_vcd_dashboard_edit_name_modal_title')}
    >
      <OsdsFormField>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          className="mt-6"
          slot="label"
        >
          {t('managed_vcd_dashboard_edit_name_modal_label')}
        </OsdsText>
        <OsdsInput
          ariaLabel="edit-input"
          type={ODS_INPUT_TYPE.text}
          value={newName}
          onOdsValueChange={(
            e: OsdsInputCustomEvent<OdsInputValueChangeEventDetail>,
          ) => setNewName(e.target.value as string)}
          color={
            isValidName
              ? ODS_THEME_COLOR_INTENT.info
              : ODS_THEME_COLOR_INTENT.error
          }
        />
        <OsdsText
          slot="helper"
          color={ODS_THEME_COLOR_INTENT.error}
          className={isValidName ? 'invisible' : 'visible'}
        >
          {t('managed_vcd_dashboard_edit_name_modal_helper_error')}
        </OsdsText>
      </OsdsFormField>

      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        onClick={onCloseModal}
      >
        {t('managed_vcd_dashboard_edit_modal_cta_cancel')}
      </OsdsButton>
      <OsdsButton
        disabled={!isButtonEnabled || undefined}
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.flat}
        aria-label="edit-name-vcd"
        onClick={handleSubmit}
      >
        {t('managed_vcd_dashboard_edit_modal_cta_edit')}
      </OsdsButton>
    </OsdsModal>
  );
};
