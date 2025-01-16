import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_INPUT_TYPE, OdsInputChangeEvent } from '@ovhcloud/ods-components';
import {
  OdsFormField,
  OdsInput,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { PciModal, PciModalProps } from '../PciModal.component';
import '../../../translations/common';

export type DeletionModalProps = PciModalProps & {
  confirmationText?: string;
  confirmationLabel?: string;
};

enum FormErrorEnum {
  NONE,
  REQUIRED,
  INVALID,
}

export function DeletionModal({
  children,
  type = 'warning',
  title,
  cancelText,
  submitText,
  isPending,
  isDisabled,
  onConfirm,
  onClose,
  onCancel,
  confirmationText,
  confirmationLabel,
}: Readonly<DeletionModalProps>) {
  const { t } = useTranslation('pci-common');

  const [formState, setFormState] = useState({
    deleteInput: '',
    error: FormErrorEnum.NONE,
    isTouched: false,
  });

  const handleInputDeleteChange = (event: OdsInputChangeEvent) => {
    setFormState({
      ...formState,
      deleteInput: event.detail.value as string,
    });
  };

  useEffect(() => {
    let error = null;
    if (formState.isTouched && !formState.deleteInput?.trim()) {
      error = FormErrorEnum.REQUIRED;
    } else if (
      formState.isTouched &&
      formState.deleteInput !== confirmationText
    ) {
      error = FormErrorEnum.INVALID;
    } else {
      error = FormErrorEnum.NONE;
    }
    setFormState({
      ...formState,
      error,
    });
  }, [formState.deleteInput, formState.isTouched]);

  const errorMessage = {
    [FormErrorEnum.REQUIRED]: t('common_field_error_required'),
    [FormErrorEnum.INVALID]: t('common_field_error_pattern'),
    [FormErrorEnum.NONE]: '',
  }[formState.error];

  return (
    <PciModal
      title={title}
      type={type || 'warning'}
      isPending={isPending}
      isDisabled={
        isPending ||
        (confirmationText && formState.deleteInput !== confirmationText) ||
        isDisabled
      }
      cancelText={cancelText}
      submitText={submitText}
      onClose={onClose}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      {children}
      {confirmationText && (
        <OdsFormField
          class="mt-6"
          data-testid="delete-formField"
          error={errorMessage}
        >
          <OdsText preset="span" className="text-[14px] font-bold">
            {confirmationLabel}
          </OdsText>
          <OdsInput
            name="delete-input"
            value={formState.deleteInput}
            type={ODS_INPUT_TYPE.text}
            data-testid="delete-input"
            onOdsChange={handleInputDeleteChange}
            className={
              errorMessage
                ? 'bg-red-100 border-red-500 text-red-500 focus:text-red-500'
                : 'border-color-[var(--ods-color-default-200)] bg-white'
            }
            onOdsBlur={() => {
              setFormState({
                ...formState,
                isTouched: true,
              });
            }}
          />
        </OdsFormField>
      )}
    </PciModal>
  );
}
