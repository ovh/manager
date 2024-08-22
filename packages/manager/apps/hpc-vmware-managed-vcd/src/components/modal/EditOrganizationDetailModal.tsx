import { ApiError } from '@ovh-ux/manager-core-api';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  OdsInputValueChangeEventDetail,
  OsdsInputCustomEvent,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsMessage,
  OsdsModal,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface EditModalProps {
  organizationDetail: string;
  headline: string;
  inputLabel: string;
  errorHelper: string;
  validateDetail: (detail: string) => boolean;
  onCloseModal: () => void;
  onEdit: (detail: string) => void;
  error: ApiError;
  hideError: () => void;
}

export const EditOrganizationDetailModal = ({
  organizationDetail,
  headline,
  inputLabel,
  errorHelper,
  validateDetail,
  onCloseModal,
  onEdit,
  error,
  hideError,
}: EditModalProps) => {
  const { t } = useTranslation('dashboard');
  const [newDetail, setNewDetail] = useState<string>(organizationDetail || '');
  const isValidDetail = validateDetail(newDetail);
  const isButtonEnabled = isValidDetail && newDetail !== organizationDetail;

  const handleSubmit = () => {
    if (isValidDetail) onEdit(newDetail);
  };

  return (
    <OsdsModal
      color={ODS_THEME_COLOR_INTENT.info}
      onOdsModalClose={onCloseModal}
      dismissible
      headline={headline}
    >
      {!!error && (
        <OsdsMessage
          type={ODS_MESSAGE_TYPE.error}
          removable
          onOdsRemoveClick={hideError}
        >
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('managed_vcd_dashboard_edit_modal_error', {
              error: error.response?.data?.message,
            })}
          </OsdsText>
        </OsdsMessage>
      )}
      <OsdsFormField>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          className="mt-6"
          slot="label"
        >
          {inputLabel}
        </OsdsText>
        <OsdsInput
          ariaLabel="edit-input"
          type={ODS_INPUT_TYPE.text}
          value={newDetail}
          onOdsValueChange={(
            e: OsdsInputCustomEvent<OdsInputValueChangeEventDetail>,
          ) => setNewDetail(e.target.value as string)}
          color={
            isValidDetail
              ? ODS_THEME_COLOR_INTENT.info
              : ODS_THEME_COLOR_INTENT.error
          }
        />
        <OsdsText
          slot="helper"
          color={ODS_THEME_COLOR_INTENT.error}
          className={isValidDetail ? 'invisible' : 'visible'}
        >
          {errorHelper}
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
        onClick={handleSubmit}
      >
        {t('managed_vcd_dashboard_edit_modal_cta_edit')}
      </OsdsButton>
    </OsdsModal>
  );
};
