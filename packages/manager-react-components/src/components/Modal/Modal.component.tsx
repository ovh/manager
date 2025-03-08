import React, { Ref } from 'react';
import {
  OdsButton,
  OdsModal,
  OdsText,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_MODAL_COLOR,
  ODS_BUTTON_COLOR,
  ODS_TEXT_PRESET,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';

export enum ModalTypeEnum {
  'INFO' = 'info',
  'HELP' = 'help',
  'SUCCESS' = 'success',
  'WARNING' = 'warning',
  'ERROR' = 'error',
}

export interface ModalProps {
  /** Title of modal */
  heading?: string;
  /** Type of modal */
  type?: ModalTypeEnum;
  /** Is loading state for display a spinner */
  isLoading?: boolean;
  /** Label of primary button */
  primaryLabel?: string;
  /** Is loading state for primary button */
  isPrimaryButtonLoading?: boolean;
  /** Is disabled state for primary button */
  isPrimaryButtonDisabled?: boolean;
  /** Action of primary button */
  onPrimaryButtonClick?: () => void;
  /** Label of secondary button */
  secondaryLabel?: string;
  /** Is loading state for secondary button */
  isSecondaryButtonDisabled?: boolean;
  /** Is loading state for secondary button */
  isSecondaryButtonLoading?: boolean;
  /** Is disabled state for secondary button */
  onSecondaryButtonClick?: () => void;
  /** Is dismissible action */
  onDismiss?: () => void;
  /** Is modal open state */
  isOpen?: boolean;
  /** Children of modal */
  children?: React.ReactNode;
}

const mapModalColorToButtonColor = (type: ModalTypeEnum) => {
  if (type === ModalTypeEnum.ERROR) {
    return ODS_BUTTON_COLOR.critical;
  }
  return ODS_BUTTON_COLOR.primary;
};

const mapModalColor = {
  info: ODS_MODAL_COLOR.information,
  help: ODS_MODAL_COLOR.neutral,
  success: ODS_MODAL_COLOR.success,
  warning: ODS_MODAL_COLOR.warning,
  error: ODS_MODAL_COLOR.critical,
};

export const Modal = React.forwardRef<HTMLOdsModalElement, ModalProps>(
  (
    {
      heading,
      type = ModalTypeEnum.INFO,
      isLoading,
      primaryLabel,
      isPrimaryButtonLoading,
      isPrimaryButtonDisabled,
      onPrimaryButtonClick,
      secondaryLabel,
      isSecondaryButtonDisabled,
      isSecondaryButtonLoading,
      onSecondaryButtonClick,
      onDismiss,
      isOpen = true,
      children,
    },
    ref: Ref<HTMLOdsModalElement>,
  ) => {
    const buttonColor = mapModalColorToButtonColor(type);

    return (
      <OdsModal
        data-testid="modal"
        color={mapModalColor[type]}
        isDismissible={!!onDismiss}
        className="text-left"
        onOdsClose={onDismiss}
        isOpen={isOpen}
        ref={ref}
      >
        {heading && (
          <OdsText className="mb-4" preset={ODS_TEXT_PRESET.heading4}>
            {heading}
          </OdsText>
        )}
        {isLoading && (
          <div data-testid="spinner" className="flex justify-center my-5">
            <OdsSpinner size={ODS_SPINNER_SIZE.md} inline-block></OdsSpinner>
          </div>
        )}
        {!isLoading && (
          <>
            <div className="flex flex-col text-left">{children}</div>
            {secondaryLabel && (
              <OdsButton
                data-testid="secondary-button"
                slot="actions"
                color={buttonColor}
                onClick={
                  !isSecondaryButtonDisabled ? onSecondaryButtonClick : null // need for don't break the test
                }
                isDisabled={isSecondaryButtonDisabled}
                isLoading={isSecondaryButtonLoading}
                variant={ODS_BUTTON_VARIANT.ghost}
                label={secondaryLabel}
                className="mt-4"
                type="button"
              />
            )}
            {primaryLabel && (
              <OdsButton
                data-testid="primary-button"
                slot="actions"
                color={buttonColor}
                onClick={!isPrimaryButtonDisabled ? onPrimaryButtonClick : null} // need for don't break the test
                isDisabled={isPrimaryButtonDisabled}
                isLoading={isPrimaryButtonLoading}
                variant={ODS_BUTTON_VARIANT.default}
                label={primaryLabel}
                className="mt-4"
                type="button"
              />
            )}
          </>
        )}
      </OdsModal>
    );
  },
);
