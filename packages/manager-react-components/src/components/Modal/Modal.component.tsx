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

export interface ModalProps {
  /** Title of modal */
  heading?: string;
  /** Type of modal. It can be any of `ODS_MODAL_COLOR` */
  type?: ODS_MODAL_COLOR;
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
  /** Test id of primary button */
  primaryButtonTestId?: string;
  /** Label of secondary button */
  secondaryLabel?: string;
  /** Is loading state for secondary button */
  isSecondaryButtonDisabled?: boolean;
  /** Is loading state for secondary button */
  isSecondaryButtonLoading?: boolean;
  /** Is disabled state for secondary button */
  onSecondaryButtonClick?: () => void;
  /** Test id of secondary button */
  secondaryButtonTestId?: string;
  /** Is dismissible action */
  onDismiss?: () => void;
  /** Is modal open state */
  isOpen?: boolean;
  /** Children of modal */
  children?: React.ReactNode;
}

const getPrimaryButtonColor = (type: ODS_MODAL_COLOR) =>
  type === ODS_MODAL_COLOR.critical
    ? ODS_BUTTON_COLOR.critical
    : ODS_BUTTON_COLOR.primary;

export const ModalComponent: React.ForwardRefRenderFunction<
  HTMLOdsModalElement,
  ModalProps
> = (
  {
    heading,
    type = ODS_MODAL_COLOR.information,
    isLoading,
    primaryLabel,
    isPrimaryButtonLoading,
    isPrimaryButtonDisabled,
    onPrimaryButtonClick,
    primaryButtonTestId,
    secondaryLabel,
    isSecondaryButtonDisabled,
    isSecondaryButtonLoading,
    onSecondaryButtonClick,
    secondaryButtonTestId,
    onDismiss,
    isOpen = true,
    children,
  },
  ref: Ref<HTMLOdsModalElement>,
) => {
  const buttonColor = getPrimaryButtonColor(type);

  return (
    <OdsModal
      data-testid="modal"
      color={ODS_MODAL_COLOR[type]}
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
          <div className="flex  flex-col text-left">{children}</div>
          {secondaryLabel && (
            <OdsButton
              data-testid={secondaryButtonTestId || 'secondary-button'}
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
              data-testid={primaryButtonTestId || 'primary-button'}
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
};

export const Modal: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<ModalProps> & React.RefAttributes<HTMLOdsModalElement>
> = React.forwardRef(ModalComponent);
Modal.displayName = 'Modal';
