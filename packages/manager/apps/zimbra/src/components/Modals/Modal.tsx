import React from 'react';
import { OsdsButton, OsdsModal } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import Loading from '@/components/Loading/Loading';

export interface ButtonType {
  testid?: string;
  action: () => void;
  label: string;
  disabled?: boolean;
  color?: ODS_THEME_COLOR_INTENT;
  variant?: ODS_BUTTON_VARIANT;
}

export interface ModalProps {
  title?: string;
  color?: ODS_THEME_COLOR_INTENT;
  dismissible?: boolean;
  isLoading?: boolean;
  onDismissible?: () => void;
  children?: React.ReactElement;
  primaryButton?: ButtonType;
  secondaryButton?: ButtonType;
}

const Modal: React.FC<ModalProps> = ({
  title,
  color,
  dismissible,
  onDismissible,
  isLoading,
  primaryButton,
  secondaryButton,
  children,
}) => {
  return (
    <OsdsModal
      data-testid="modal"
      color={color}
      headline={title}
      dismissible={dismissible}
      className="text-left"
      onOdsModalClose={onDismissible}
    >
      {!isLoading && <div className="flex flex-col text-left">{children}</div>}
      {isLoading && <Loading />}

      {secondaryButton && (
        <OsdsButton
          {...(secondaryButton.testid
            ? { 'data-testid': secondaryButton.testid }
            : {})}
          slot="actions"
          inline
          color={secondaryButton.color ?? ODS_THEME_COLOR_INTENT.primary}
          onClick={!secondaryButton.disabled ? secondaryButton.action : null}
          {...(secondaryButton.disabled || isLoading ? { disabled: true } : {})}
          variant={secondaryButton.variant ?? ODS_BUTTON_VARIANT.stroked}
        >
          {secondaryButton.label}
        </OsdsButton>
      )}
      {primaryButton && (
        <OsdsButton
          {...(primaryButton.testid
            ? { 'data-testid': primaryButton.testid }
            : {})}
          slot="actions"
          inline
          color={primaryButton.color ?? ODS_THEME_COLOR_INTENT.primary}
          onClick={!primaryButton.disabled ? primaryButton.action : null}
          {...(primaryButton.disabled || isLoading ? { disabled: true } : {})}
          variant={primaryButton.variant ?? ODS_BUTTON_VARIANT.flat}
        >
          {primaryButton.label}
        </OsdsButton>
      )}
    </OsdsModal>
  );
};

export default Modal;
