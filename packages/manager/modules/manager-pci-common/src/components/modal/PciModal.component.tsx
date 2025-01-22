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
      color={type === 'warning' ? 'warning' : 'information'}
      data-testid="pciModal-modal"
      isOpen
      onOdsClose={onClose}
    >
      <>
        <OdsText preset="heading-3">{title}</OdsText>
        <slot name="content">
          {isPending ? (
            <OdsSpinner
              size="md"
              className="block text-center mt-6 mb-8"
              data-testid="pciModal-spinner"
            />
          ) : (
            <div className="mt-6 mb-8">{children}</div>
          )}
        </slot>

        <OdsButton
          label={cancelText || t('common_cancel')}
          color="primary"
          variant="ghost"
          onClick={onCancel}
          isDisabled={isPending}
          slot="actions"
          data-testid="pciModal-button_cancel"
        />
        <OdsButton
          label={submitText || t('common_confirm')}
          color="primary"
          onClick={onConfirm}
          isDisabled={isDisabled || isPending}
          slot="actions"
          data-testid="pciModal-button_submit"
        />
      </>
    </OdsModal>
  );
}
