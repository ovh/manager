import React, { PropsWithChildren } from 'react';
import {
  OdsDrawer,
  OdsDivider,
  OdsButton,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_TEXT_PRESET,
  ODS_SPINNER_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';

type DrawerProps = PropsWithChildren & {
  /** Drawer title */
  title: string;
  /** Open/close the drawer */
  isOpen: boolean;
  /** Show a loader instead of the drawer content  */
  isLoading?: boolean;
  /** Called when the drawer is closed internally */
  onClose?: () => void;
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
};

export const Drawer = ({
  children,
  title,
  isOpen,
  isLoading,
  onClose,
  isPrimaryButtonLoading,
  isPrimaryButtonDisabled,
  onPrimaryButtonClick,
  primaryLabel,
  isSecondaryButtonLoading,
  isSecondaryButtonDisabled,
  onSecondaryButtonClick,
  secondaryLabel,
}: DrawerProps) => {
  const hasPrimaryButton = Boolean(primaryLabel);
  const hasSecondaryButton = Boolean(secondaryLabel);
  const hasFooter = hasPrimaryButton || hasSecondaryButton;

  return (
    <OdsDrawer
      isOpen={isOpen}
      position={'right'}
      onOdsClose={onClose}
      className="[&::part(drawer)]:w-[512px] [&::part(drawer)]:p-0"
    >
      {isLoading && (
        <div
          data-testid="spinner"
          className="h-full flex justify-center items-center"
        >
          <OdsSpinner size={ODS_SPINNER_SIZE.md} inline-block></OdsSpinner>
        </div>
      )}

      {!isLoading && (
        <div className="h-full flex flex-col justify-between">
          <header className="p-4 pb-0">
            <OdsText preset={ODS_TEXT_PRESET.heading2}>{title}</OdsText>
          </header>

          <section className="p-4 flex flex-grow">{children}</section>

          {hasFooter && (
            <footer>
              <OdsDivider className="w-full" />
              <div className="p-6 space-x-4">
                {hasSecondaryButton && (
                  <OdsButton
                    variant={ODS_BUTTON_VARIANT.ghost}
                    label={secondaryLabel}
                    isLoading={isSecondaryButtonLoading}
                    isDisabled={isSecondaryButtonDisabled}
                    onClick={onSecondaryButtonClick}
                    color={ODS_BUTTON_COLOR.primary}
                  />
                )}
                {hasPrimaryButton && (
                  <OdsButton
                    label={primaryLabel}
                    isLoading={isPrimaryButtonLoading}
                    isDisabled={isPrimaryButtonDisabled}
                    onClick={onPrimaryButtonClick}
                    color={ODS_BUTTON_COLOR.primary}
                  />
                )}
              </div>
            </footer>
          )}
        </div>
      )}
    </OdsDrawer>
  );
};
