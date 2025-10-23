import { BUTTON_COLOR, BUTTON_VARIANT } from '@ovhcloud/ods-react';

import { Button } from '../../button/Button.component';
import { DrawerFooterProps } from './DrawerFooter.props';

export const DrawerFooter = ({ primaryButton, secondaryButton }: DrawerFooterProps) => {
  const {
    label: primaryButtonLabel,
    isLoading: isPrimaryButtonLoading,
    isDisabled: isPrimaryButtonDisabled,
    onClick: onPrimaryButtonClick,
  } = primaryButton || {};
  const {
    label: secondaryButtonLabel,
    isLoading: isSecondaryButtonLoading,
    isDisabled: isSecondaryButtonDisabled,
    onClick: onSecondaryButtonClick,
  } = secondaryButton || {};
  return (
    <footer className="p-6 space-x-2">
      {secondaryButtonLabel && (
        <Button
          variant={BUTTON_VARIANT.ghost}
          loading={isSecondaryButtonLoading}
          disabled={isSecondaryButtonDisabled}
          onClick={onSecondaryButtonClick}
          color={BUTTON_COLOR.primary}
        >
          {secondaryButtonLabel}
        </Button>
      )}
      {primaryButtonLabel && (
        <Button
          variant={BUTTON_VARIANT.default}
          loading={isPrimaryButtonLoading}
          disabled={isPrimaryButtonDisabled}
          onClick={onPrimaryButtonClick}
          color={BUTTON_COLOR.primary}
        >
          {primaryButtonLabel}
        </Button>
      )}
    </footer>
  );
};
