import { OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT, ODS_BUTTON_COLOR } from '@ovhcloud/ods-components';
import { DrawerFooterProps } from './DrawerFooter.props';

export const DrawerFooter = ({
  primaryButtonLabel,
  isPrimaryButtonLoading,
  isPrimaryButtonDisabled,
  onPrimaryButtonClick,
  secondaryButtonLabel,
  isSecondaryButtonLoading,
  isSecondaryButtonDisabled,
  onSecondaryButtonClick,
}: DrawerFooterProps) => {
  return (
    <footer className="p-6 space-x-2">
      {secondaryButtonLabel && (
        <OdsButton
          variant={ODS_BUTTON_VARIANT.ghost}
          label={secondaryButtonLabel}
          isLoading={isSecondaryButtonLoading}
          isDisabled={isSecondaryButtonDisabled}
          onClick={onSecondaryButtonClick}
          color={ODS_BUTTON_COLOR.primary}
        />
      )}
      {primaryButtonLabel && (
        <OdsButton
          variant={ODS_BUTTON_VARIANT.default}
          label={primaryButtonLabel}
          isLoading={isPrimaryButtonLoading}
          isDisabled={isPrimaryButtonDisabled}
          onClick={onPrimaryButtonClick}
          color={ODS_BUTTON_COLOR.primary}
        />
      )}
    </footer>
  );
};
