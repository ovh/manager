import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_MODAL_COLOR,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsModal,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export type PciModalProps = {
  children?: React.ReactNode;
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
    <OdsModal
      color={
        type === 'warning'
          ? ODS_MODAL_COLOR.warning
          : ODS_MODAL_COLOR.information
      }
      data-testid="pciModal-modal"
      onOdsClose={onClose}
    >
      <>
        <OdsText preset="heading-3">{title}</OdsText>
        <slot name="content">
          {isPending ? (
            <OdsSpinner
              size={ODS_SPINNER_SIZE.md}
              className="block text-center mt-6"
              data-testid="pciModal-spinner"
            />
          ) : (
            <div className="mt-6">{children}</div>
          )}
        </slot>

        <OdsButton
          label={cancelText || t('common_cancel')}
          color={ODS_BUTTON_COLOR.primary}
          variant={ODS_BUTTON_VARIANT.ghost}
          onClick={onCancel}
          data-testid="pciModal-button_cancel"
        />
        <OdsButton
          label={submitText || t('common_confirm')}
          color={ODS_BUTTON_COLOR.primary}
          onClick={onConfirm}
          isDisabled={isDisabled}
          data-testid="pciModal-button_submit"
        />
      </>
    </OdsModal>
  );
}
