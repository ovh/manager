import React, { Ref } from 'react';
import { OdsButton, OdsModal, OdsText } from '@ovhcloud/ods-components/react';
import {
  JSX,
  ODS_BUTTON_VARIANT,
  ODS_MODAL_COLOR,
  ODS_BUTTON_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { Loading } from '@/components';

export type ButtonType = {
  testid?: string;
} & Omit<
  JSX.OdsButton & React.HTMLAttributes<HTMLOdsButtonElement>,
  'slot' | 'color' | 'variant'
>;

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

export const Modal = React.forwardRef<HTMLOdsModalElement, ModalProps>(
  (
    {
      color = ODS_MODAL_COLOR.information,
      isDismissible,
      onClose,
      isLoading,
      primaryButton,
      secondaryButton,
      children,
      isOpen,
      title,
    },
    ref: Ref<HTMLOdsModalElement>,
  ) => {
    const buttonColor = mapModalColorToButtonColor(color);

    return (
      <OdsModal
        data-testid="modal"
        color={color}
        isDismissible={isDismissible}
        className="text-left"
        onOdsClose={onClose}
        isOpen={isOpen}
        ref={ref}
      >
        {title && (
          <OdsText className="mb-4" preset={ODS_TEXT_PRESET.heading4}>
            {title}
          </OdsText>
        )}
        {!isLoading && (
          <div className="flex flex-col text-left">{children}</div>
        )}
        {isLoading && <Loading />}
        {secondaryButton && (
          <OdsButton
            {...(secondaryButton.testid
              ? { 'data-testid': secondaryButton.testid }
              : {})}
            {...secondaryButton}
            slot="actions"
            color={buttonColor}
            variant={ODS_BUTTON_VARIANT.ghost}
            className="mt-4"
          />
        )}
        {primaryButton && (
          <OdsButton
            {...(primaryButton.testid
              ? { 'data-testid': primaryButton.testid }
              : {})}
            {...primaryButton}
            slot="actions"
            color={buttonColor}
            isLoading={primaryButton.isLoading || isLoading}
            variant={ODS_BUTTON_VARIANT.default}
            className="mt-4"
          />
        )}
      </OdsModal>
    );
  },
);

export default Modal;
