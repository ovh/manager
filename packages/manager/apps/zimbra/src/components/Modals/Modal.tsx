import React from 'react';
import { OdsButton, OdsModal, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_MODAL_COLOR,
  ODS_BUTTON_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import Loading from '@/components/Loading/Loading';

export interface ButtonType {
  testid?: string;
  action: () => void;
  label: string;
  disabled?: boolean;
  color?: ODS_BUTTON_COLOR;
  variant?: ODS_BUTTON_VARIANT;
}

export interface ModalProps {
  title?: string;
  color?: ODS_MODAL_COLOR;
  isDismissible?: boolean;
  isLoading?: boolean;
  isOpen?: boolean;
  onDismissible?: () => void;
  children?: React.ReactElement;
  primaryButton?: ButtonType;
  secondaryButton?: ButtonType;
}

const Modal: React.FC<ModalProps> = ({
  color = ODS_MODAL_COLOR.information,
  isDismissible,
  onDismissible,
  isLoading,
  primaryButton,
  secondaryButton,
  children,
  isOpen,
  title,
}) => {
  const mapModalColorToButtonColor = (modalColor: ODS_MODAL_COLOR) => {
    if (modalColor === ODS_MODAL_COLOR.critical) {
      return ODS_BUTTON_COLOR.critical;
    }
    return ODS_BUTTON_COLOR.primary;
  };

  const buttonColor = mapModalColorToButtonColor(color);

  return (
    <OdsModal
      data-testid="modal"
      color={color}
      isDismissible={isDismissible}
      className="text-left"
      onOdsClose={onDismissible}
      isOpen={isOpen}
    >
      <OdsText preset={ODS_TEXT_PRESET.heading6}>{title}</OdsText>
      {!isLoading && <div className="flex flex-col text-left">{children}</div>}
      {isLoading && <Loading />}
      {secondaryButton && (
        <OdsButton
          {...(secondaryButton.testid
            ? { 'data-testid': secondaryButton.testid }
            : {})}
          slot="actions"
          inline-block
          color={buttonColor}
          onClick={!secondaryButton.disabled ? secondaryButton.action : null}
          {...(secondaryButton.disabled || isLoading ? { disabled: true } : {})}
          variant={secondaryButton.variant ?? ODS_BUTTON_VARIANT.outline}
          label={secondaryButton.label}
          className="mt-4"
        />
      )}
      {primaryButton && (
        <OdsButton
          {...(primaryButton.testid
            ? { 'data-testid': primaryButton.testid }
            : {})}
          slot="actions"
          inline-block
          color={buttonColor}
          onClick={!primaryButton.disabled ? primaryButton.action : null}
          {...(primaryButton.disabled || isLoading ? { disabled: true } : {})}
          variant={primaryButton.variant ?? ODS_BUTTON_VARIANT.outline}
          label={primaryButton.label}
          className="mt-4"
        />
      )}
    </OdsModal>
  );
};

export default Modal;
