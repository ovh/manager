import React from 'react';
import { OdsButton, OdsModal, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_MODAL_COLOR,
  ODS_BUTTON_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import Loading from '@/components/loading/Loading.component';

export interface ButtonType {
  testid?: string;
  action: () => void;
  label: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  variant?: ODS_BUTTON_VARIANT;
}

export interface ModalProps {
  title?: string;
  color?: ODS_MODAL_COLOR;
  isDismissible?: boolean;
  isLoading?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  children?: React.ReactElement;
  primaryButton?: ButtonType;
  secondaryButton?: ButtonType;
}

const mapModalColorToButtonColor = (modalColor: ODS_MODAL_COLOR) => {
  if (modalColor === ODS_MODAL_COLOR.critical) {
    return ODS_BUTTON_COLOR.critical;
  }
  return ODS_BUTTON_COLOR.primary;
};

const Modal: React.FC<ModalProps> = ({
  color = ODS_MODAL_COLOR.information,
  isDismissible,
  onClose,
  isLoading,
  primaryButton,
  secondaryButton,
  children,
  isOpen,
  title,
}) => {
  const buttonColor = mapModalColorToButtonColor(color);

  return (
    <OdsModal
      data-testid="modal"
      color={color}
      isDismissible={isDismissible}
      className="text-left max-height-modal"
      onOdsClose={onClose}
      isOpen={isOpen}
    >
      <OdsText className="mb-8" preset={ODS_TEXT_PRESET.heading4}>
        {title}
      </OdsText>
      {!isLoading && <div className="flex flex-col text-left">{children}</div>}
      {isLoading && <Loading />}
      {secondaryButton && (
        <OdsButton
          {...(secondaryButton.testid
            ? { 'data-testid': secondaryButton.testid }
            : {})}
          slot="actions"
          color={buttonColor}
          onClick={!secondaryButton.isDisabled ? secondaryButton.action : null}
          isDisabled={secondaryButton.isDisabled}
          isLoading={secondaryButton.isLoading}
          variant={ODS_BUTTON_VARIANT.ghost}
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
          color={buttonColor}
          onClick={!primaryButton.isDisabled ? primaryButton.action : null}
          isDisabled={primaryButton.isDisabled}
          isLoading={primaryButton.isLoading || isLoading}
          variant={primaryButton.variant ?? ODS_BUTTON_VARIANT.default}
          label={primaryButton.label}
          className="mt-4"
        />
      )}
    </OdsModal>
  );
};

export default Modal;
