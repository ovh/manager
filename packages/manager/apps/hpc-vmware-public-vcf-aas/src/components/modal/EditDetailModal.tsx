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
import TEST_IDS from '@/utils/testIds.constants';

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
  const [updateError, setUpdateError] = useState(error);
  const isValid = validateDetail(newDetail);
  const isButtonEnabled = isValid && newDetail !== detailValue && !isLoading;

  const handleSubmit = async () => {
    if (isValid) {
      try {
        await onEdit(newDetail);
      } catch (err) {
        setUpdateError(err);
      }
    }
  };

  return (
    <OdsModal onOdsClose={onCloseModal} isOpen isDismissible>
      <div className="flex flex-col">
        <OdsText preset="heading-3">{headline}</OdsText>
        {!!updateError && (
          <OdsMessage
            color="danger"
            isDismissible
            onOdsRemove={() => setUpdateError(null)}
          >
            {t('managed_vcd_dashboard_edit_modal_error', {
              error:
                updateError.response?.data?.message || updateError?.message,
            })}
          </OdsMessage>
        )}
      </div>
      <OdsFormField
        className="flex flex-col"
        error={isValid ? undefined : errorHelper}
      >
        <OdsText className="mt-6" slot="label">
          {inputLabel}
        </OdsText>
        <OdsInput
          name="edit-detail"
          type="text"
          value={newDetail}
          onOdsChange={(e) => setNewDetail(e.target.value as string)}
          hasError={!isValid}
          ariaLabel="edit-input"
        />
        <OdsText
          slot="helper"
          preset="caption"
          className={`ods-field-helper ${isValid ? 'block' : 'hidden'}`}
        >
          {errorHelper}
        </OdsText>
      </OdsFormField>
      {isLoading && <Loading slot="actions" className="w-9 mr-4" />}
      <div className="flex gap-x-4 w-fit justify-self-center ml-auto mt-6">
        <OdsButton
          label={t('managed_vcd_dashboard_edit_modal_cta_cancel')}
          variant="ghost"
          onClick={onCloseModal}
        />
        <OdsButton
          label={t('managed_vcd_dashboard_edit_modal_cta_edit')}
          onClick={handleSubmit}
          isDisabled={!isButtonEnabled || undefined}
          data-testid={TEST_IDS.modalSubmitCta}
          type="submit"
        />
      </div>
    </OdsModal>
  );
};
