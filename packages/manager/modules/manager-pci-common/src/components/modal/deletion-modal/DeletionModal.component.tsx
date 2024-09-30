import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_INPUT_TYPE,
  ODS_TEXT_SIZE,
  OdsInputValueChangeEvent,
} from '@ovhcloud/ods-components';
import {
  OsdsFormField,
  OsdsInput,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../../translations/common';
import { PciModal, PciModalProps } from '../PciModal.component';

export type DeletionModalProps = PciModalProps & {
  confirmationText?: string;
  confirmationLabel?: string;
  inputErrorMessage?: string;
};

export function DeletionModal({
  children,
  type,
  title,
  cancelText,
  submitText,
  isPending,
  onConfirm,
  onClose,
  onCancel,
  confirmationText,
  confirmationLabel,
  inputErrorMessage,
}: Readonly<DeletionModalProps>) {
  const { t } = useTranslation('pci-common');

  const [formState, setFormState] = useState({
    deleteInput: '',
    hasError: false,
    isTouched: false,
  });

  const handleInputDeleteChange = (event: OdsInputValueChangeEvent) => {
    setFormState({
      ...formState,
      deleteInput: event.detail.value,
    });
  };

  useEffect(() => {
    setFormState({
      ...formState,
      hasError:
        formState.isTouched && formState.deleteInput !== confirmationText,
    });
  }, [formState.deleteInput, formState.isTouched]);

  const isDisabled =
    isPending ||
    (confirmationText && formState.deleteInput !== confirmationText);

  const errorMessage = inputErrorMessage || t('common_field_error_required');

  return (
    <PciModal
      title={title}
      type={type}
      isPending={isPending}
      isDisabled={isDisabled}
      cancelText={cancelText}
      submitText={submitText}
      onClose={onClose}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      {children}
      {confirmationText && (
        <OsdsFormField
          class="mt-6"
          data-testid="delete-formField"
          error={formState.hasError ? errorMessage : ''}
        >
          <OsdsText
            slot="label"
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._200}
          >
            {confirmationLabel}
          </OsdsText>
          <OsdsInput
            value={formState.deleteInput}
            type={ODS_INPUT_TYPE.text}
            data-testid="delete-input"
            onOdsValueChange={handleInputDeleteChange}
            className={
              formState.hasError
                ? 'bg-red-100 border-red-500 text-red-500 focus:text-red-500'
                : 'border-color-[var(--ods-color-default-200)] bg-white'
            }
            onOdsInputBlur={() => {
              setFormState({
                ...formState,
                isTouched: true,
              });
            }}
          />
        </OsdsFormField>
      )}
    </PciModal>
  );
}
