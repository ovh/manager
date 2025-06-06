import { useState, PropsWithChildren } from 'react';
import {
  OdsButton,
  OdsDrawer,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_TEXT_PRESET,
  ODS_SPINNER_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import clsx from 'clsx';
import { DrawerVariant, DrawerCollapseState } from './Drawer.types';
import DrawerBackdrop from './DrawerBackdrop.component';
import DrawerHandle from './DrawerHandle.component';

export type DrawerProps = PropsWithChildren & {
  /** Drawer heading */
  heading: string;
  /** Open/close the drawer */
  isOpen: boolean;
  /** Called when the drawer is closed internally */
  onDismiss: () => void;
  /** Collapsible variant has a handle and no backdrop overlay */
  variant?: DrawerVariant;
  /** Show a loader instead of the drawer content  */
  isLoading?: boolean;
  /** Primary Button Label */
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

export const Drawer = ({
  children,
  heading,
  isOpen,
  variant = 'classic',
  isLoading,
  onDismiss,
  isPrimaryButtonLoading,
  isPrimaryButtonDisabled,
  onPrimaryButtonClick,
  primaryButtonLabel,
  isSecondaryButtonLoading,
  isSecondaryButtonDisabled,
  onSecondaryButtonClick,
  secondaryButtonLabel,
}: DrawerProps) => {
  const [collapseState, setCollapsedState] =
    useState<DrawerCollapseState>('visible');
  const hasPrimaryButton = Boolean(primaryButtonLabel);
  const hasSecondaryButton = Boolean(secondaryButtonLabel);
  const hasFooter = hasPrimaryButton || hasSecondaryButton;

  const handleToggleCollapseState = () => {
    setCollapsedState((prevState) =>
      prevState === 'visible' ? 'hidden' : 'visible',
    );
  };

  return (
    <div className="relative bg-transparent">
      <OdsDrawer
        data-testid="drawer"
        isOpen={isOpen}
        position={'right'}
        onOdsClose={onDismiss}
        className={clsx(
          '[&::part(drawer)]:w-[456px] [&::part(drawer)]:p-0 [&::part(drawer)]:duration-300',
          collapseState === 'hidden' && `[&::part(drawer)]:translate-x-[456px]`,
        )}
      >
        {isLoading && (
          <div
            data-testid="drawer-spinner"
            className="h-full flex justify-center items-center"
          >
            <OdsSpinner size={ODS_SPINNER_SIZE.md}></OdsSpinner>
          </div>
        )}

        {!isLoading && (
          <div className="h-screen overflow-hidden flex flex-col justify-between">
            <header className="px-[24px] min-h-[100px] flex items-center">
              <div className="flex justify-between items-center w-full py-[24px] space-x-[8px]">
                <OdsText preset={ODS_TEXT_PRESET.heading2}>{heading}</OdsText>
                <OdsButton
                  data-testid="drawer-dismiss-button"
                  label=""
                  aria-label="Dismiss"
                  icon="xmark"
                  onClick={onDismiss}
                  color={ODS_BUTTON_COLOR.primary}
                  variant={ODS_BUTTON_VARIANT.ghost}
                />
              </div>
            </header>

            <section className="px-[24px] flex-1 overflow-y-auto outline-none">
              {children}
            </section>

            {hasFooter && (
              <footer className="px-[24px] py-[24px] space-x-[8px]">
                {hasSecondaryButton && (
                  <OdsButton
                    data-testid="drawer-secondary-button"
                    variant={ODS_BUTTON_VARIANT.ghost}
                    label={secondaryButtonLabel}
                    isLoading={isSecondaryButtonLoading}
                    isDisabled={isSecondaryButtonDisabled}
                    onClick={onSecondaryButtonClick}
                    color={ODS_BUTTON_COLOR.primary}
                  />
                )}
                {hasPrimaryButton && (
                  <OdsButton
                    data-testid="drawer-primary-button"
                    variant={ODS_BUTTON_VARIANT.default}
                    label={primaryButtonLabel}
                    isLoading={isPrimaryButtonLoading}
                    isDisabled={isPrimaryButtonDisabled}
                    onClick={onPrimaryButtonClick}
                    color={ODS_BUTTON_COLOR.primary}
                  />
                )}
              </footer>
            )}
          </div>
        )}
      </OdsDrawer>
      {isOpen && variant === 'collapsible' && (
        <DrawerHandle
          onClick={handleToggleCollapseState}
          collapseState={collapseState}
        />
      )}
      {isOpen && variant === 'classic' && (
        <DrawerBackdrop onClick={onDismiss} />
      )}
    </div>
  );
};
