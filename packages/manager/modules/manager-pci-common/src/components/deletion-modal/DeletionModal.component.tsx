import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsModal,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_SIZE,
  OdsInputValueChangeEvent,
} from '@ovhcloud/ods-components';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../translations/common';

type DeletionModalProps = {
  children: React.ReactNode;
  type: 'warning' | 'default';
  title: string;
  isPending: boolean;
  confirmationText?: string;
  confirmationLabel?: string;
  cancelText: string;
  submitText: string;
  onConfirm: () => void;
  onClose: () => void;
  onCancel: () => void;
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

  return (
    <OsdsModal
      color={type === 'warning' ? ODS_THEME_COLOR_INTENT.warning : undefined}
      headline={title}
      onOdsModalClose={onClose}
    >
      <slot name="content">
        {isPending ? (
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            className="block text-center"
            data-testid="delete-spinner"
          />
        ) : (
          <div className="mt-6">
            {children}
            {confirmationText && (
              <OsdsFormField
                class="mt-6"
                data-testid="delete-formfield"
                error={
                  formState.hasError ? t('common_field_error_required') : ''
                }
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
          </div>
        )}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={onCancel}
        data-testid="delete-button_cancel"
      >
        {cancelText}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onConfirm}
        disabled={isDisabled || undefined}
        data-testid="delete-button_submit"
      >
        {submitText}
      </OsdsButton>
    </OsdsModal>
  );
}
