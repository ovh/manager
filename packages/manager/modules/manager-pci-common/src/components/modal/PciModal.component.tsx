import {
  OsdsButton,
  OsdsModal,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_VARIANT, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';

export type PciModalProps = {
  children: React.ReactNode;
  type?: 'warning' | 'default';
  title: string;
  isPending?: boolean;
  isDisabled?: boolean;
  cancelText?: string;
  submitText?: string;
  onConfirm: () => void;
  onClose: () => void;
  onCancel: () => void;
};

export function PciModal({
  children,
  type,
  title,
  cancelText,
  submitText,
  isPending,
  isDisabled,
  onConfirm,
  onClose,
  onCancel,
}: Readonly<PciModalProps>) {
  const { t } = useTranslation('pci-common');
  return (
    <OsdsModal
      color={
        type === 'warning'
          ? ODS_THEME_COLOR_INTENT.warning
          : ODS_THEME_COLOR_INTENT.primary
      }
      headline={title}
      data-testid="pciModal-modal"
      onOdsModalClose={onClose}
    >
      <slot name="content">
        {isPending ? (
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            className="block text-center mt-6"
            data-testid="pciModal-spinner"
          />
        ) : (
          <div className="mt-6">{children}</div>
        )}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={onCancel}
        data-testid="pciModal-button_cancel"
      >
        {cancelText || t('common_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onConfirm}
        disabled={isDisabled || undefined}
        data-testid="pciModal-button_submit"
      >
        {submitText || t('common_confirm')}
      </OsdsButton>
    </OsdsModal>
  );
}
