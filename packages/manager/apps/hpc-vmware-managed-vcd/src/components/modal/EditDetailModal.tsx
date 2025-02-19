import { ApiError } from '@ovh-ux/manager-core-api';
import {
  OdsButton,
  OdsFormField,
  OdsInput,
  OdsMessage,
  OdsModal,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { AxiosResponse } from 'axios';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from '../loading/Loading.component';

interface EditModalProps {
  detailValue: string;
  headline: string;
  inputLabel: string;
  errorHelper: string;
  validateDetail: (detail: string) => boolean;
  onCloseModal: () => void;
  onEdit: (detail: string) => Promise<AxiosResponse<unknown>>;
  error: ApiError | null;
  isLoading: boolean;
}

export const EditDetailModal = ({
  detailValue,
  headline,
  inputLabel,
  errorHelper,
  validateDetail,
  onCloseModal,
  onEdit,
  error,
  isLoading,
}: EditModalProps) => {
  const { t } = useTranslation('dashboard');
  const [newDetail, setNewDetail] = useState<string>(detailValue || '');
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const isValidDetail = validateDetail(newDetail);
  const isButtonEnabled =
    isValidDetail && newDetail !== detailValue && !isLoading;

  const handleSubmit = async () => {
    if (isValidDetail) {
      setIsErrorVisible(false);
      try {
        await onEdit(newDetail);
      } catch (err) {
        setIsErrorVisible(true);
      }
    }
  };

  return (
    <OdsModal onOdsClose={onCloseModal}>
      <OdsText preset="heading-3">{headline}</OdsText>
      {!!error && isErrorVisible && (
        <OdsMessage
          color="danger"
          isDismissible
          onOdsRemove={() => setIsErrorVisible(false)}
        >
          {t('managed_vcd_dashboard_edit_modal_error', {
            error: error.response?.data?.message,
          })}
        </OdsMessage>
      )}
      <OdsFormField>
        <OdsText className="mt-6" slot="label">
          {inputLabel}
        </OdsText>
        <OdsInput
          name="edit-detail"
          type="text"
          value={newDetail}
          onOdsChange={(e) => setNewDetail(e.target.value as string)}
          hasError={!isValidDetail}
          ariaLabel="edit-input"
        />
        <OdsText
          slot="helper"
          // color={ODS_THEME_COLOR_INTENT.error} // TODO : use CSS variables
          className={isValidDetail ? 'invisible' : 'visible'}
        >
          {errorHelper}
        </OdsText>
      </OdsFormField>

      {isLoading && <Loading slot="actions" className="w-9 mr-4" />}
      <OdsButton
        label={t('managed_vcd_dashboard_edit_modal_cta_cancel')}
        variant="outline"
        onClick={onCloseModal}
      />
      <OdsButton
        label={t('managed_vcd_dashboard_edit_modal_cta_edit')}
        variant="ghost"
        onClick={handleSubmit}
        isDisabled={!isButtonEnabled || undefined}
      />
    </OdsModal>
  );
};
