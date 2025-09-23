import React, { PropsWithChildren } from 'react';
import { OdsButton } from '@ovhcloud/ods-components/react';

// Sub components for the drawer
// Those components will be moved to MRC to get a composable version of the drawer

export const DrawerContent = ({ children }: PropsWithChildren) => {
  return <div className="flex flex-1 flex-col">{children}</div>;
};

export type DrawerFooterProps = PropsWithChildren & {
  primaryButtonLabel?: string;
  /** Primary Button Loading State */
  isPrimaryButtonLoading?: boolean;
  /** Primary Button Disabled State */
  isPrimaryButtonDisabled?: boolean;
  /** Primary Button Callback */
  onPrimaryButtonClick?: () => void;
  /** Secondary Button Label */
  secondaryButtonLabel?: string;
  /** Secondary Button Disabled State */
  isSecondaryButtonDisabled?: boolean;
  /** Secondary Button Loading State */
  isSecondaryButtonLoading?: boolean;
  /** Secondary Button Callback */
  onSecondaryButtonClick?: () => void;
};

export const DrawerFooter = ({
  isPrimaryButtonLoading,
  isPrimaryButtonDisabled,
  onPrimaryButtonClick,
  primaryButtonLabel,
  isSecondaryButtonLoading,
  isSecondaryButtonDisabled,
  onSecondaryButtonClick,
  secondaryButtonLabel,
}: DrawerFooterProps) => {
  return (
    <footer className="mb-6 space-x-2 ">
      {secondaryButtonLabel && (
        <OdsButton
          variant={'ghost'}
          label={secondaryButtonLabel}
          isLoading={isSecondaryButtonLoading}
          isDisabled={isSecondaryButtonDisabled}
          onClick={onSecondaryButtonClick}
          color={'primary'}
        />
      )}
      {primaryButtonLabel && (
        <OdsButton
          variant={'default'}
          label={primaryButtonLabel}
          isLoading={isPrimaryButtonLoading}
          isDisabled={isPrimaryButtonDisabled}
          onClick={onPrimaryButtonClick}
          color={'primary'}
        />
      )}
    </footer>
  );
};
