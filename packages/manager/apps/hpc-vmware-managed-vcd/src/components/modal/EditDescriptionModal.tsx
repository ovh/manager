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
  organizationDescription: string;
  onCloseModal: () => void;
  onEdit: (desc: string) => void;
}

const validateDescription = (desc: string) => /^.{1,256}$/.test(desc);

export const EditDescriptionModal = ({
  organizationDescription,
  onCloseModal,
  onEdit,
}: EditModalProps) => {
  const { t } = useTranslation('dashboard');
  const [newDesc, setNewDesc] = useState<string>(organizationDescription || '');
  const isValidDesc = validateDescription(newDesc);
  const isButtonEnabled = isValidDesc && newDesc !== organizationDescription;

  const handleSubmit = () => {
    if (isValidDesc) {
      onEdit(newDesc);
      onCloseModal();
    }
  };

  return (
    <OsdsModal
      color={ODS_THEME_COLOR_INTENT.info}
      onOdsModalClose={onCloseModal}
      dismissible
      headline={t('managed_vcd_dashboard_edit_desc_modal_title')}
    >
      <OsdsFormField>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          className="mt-6"
          slot="label"
        >
          {t('managed_vcd_dashboard_edit_desc_modal_label')}
        </OsdsText>
        <OsdsInput
          ariaLabel="edit-input"
          type={ODS_INPUT_TYPE.text}
          value={newDesc}
          onOdsValueChange={(
            e: OsdsInputCustomEvent<OdsInputValueChangeEventDetail>,
          ) => setNewDesc(e.target.value as string)}
          color={
            isValidDesc
              ? ODS_THEME_COLOR_INTENT.info
              : ODS_THEME_COLOR_INTENT.error
          }
        />
        <OsdsText
          slot="helper"
          color={ODS_THEME_COLOR_INTENT.error}
          className={isValidDesc ? 'invisible' : 'visible'}
        >
          {t('managed_vcd_dashboard_edit_desc_modal_helper_error')}
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
        aria-label="edit-desc-vcd"
        onClick={handleSubmit}
      >
        {t('managed_vcd_dashboard_edit_modal_cta_edit')}
      </OsdsButton>
    </OsdsModal>
  );
};
