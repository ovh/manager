import { PropsWithChildren } from 'react';
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
import { useTranslation } from 'react-i18next';
import './translations';

export type DrawerBaseProps = PropsWithChildren & {
  /** Drawer heading */
  heading: string;
  /** Open/close the drawer (default to true) */
  isOpen?: boolean;
  /** Callback function to be called on close of the Drawer */
  onDismiss: () => void;
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
  className?: string;
};

export const DrawerBase = ({
  children,
  heading,
  isOpen = true,
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
  className,
}: DrawerBaseProps) => {
  const { t } = useTranslation('drawer');

  return (
    <OdsDrawer
      data-testid="drawer"
      isOpen={isOpen}
      position={'right'}
      onOdsClose={onDismiss}
      className={clsx(
        '[&::part(drawer)]:w-full [&::part(drawer)]:sm:w-[var(--mrc-drawer-width)] [&::part(drawer)]:max-w-full [&::part(drawer)]:p-0',
        className,
      )}
    >
      <div className="h-screen overflow-hidden flex flex-col justify-between">
        <header className="min-h-[var(--mrc-drawer-header-height)] px-6 flex items-center">
          <div
            className={clsx(
              'flex items-center w-full py-6 space-x-2',
              !isLoading ? 'justify-between' : 'justify-end',
            )}
          >
            {!isLoading && (
              <OdsText preset={ODS_TEXT_PRESET.heading2}>{heading}</OdsText>
            )}
            <OdsButton
              data-testid="drawer-dismiss-button"
              label=""
              aria-label={t('close')}
              icon="xmark"
              onClick={onDismiss}
              color={ODS_BUTTON_COLOR.primary}
              variant={ODS_BUTTON_VARIANT.ghost}
            />
          </div>
        </header>

        {isLoading && (
          <div
            data-testid="drawer-spinner"
            className="h-full flex justify-center items-center"
          >
            <OdsSpinner size={ODS_SPINNER_SIZE.md}></OdsSpinner>
          </div>
        )}

        {!isLoading && (
          <>
            <section className="px-6 flex-1 overflow-y-auto outline-none">
              {children}
            </section>

            {(primaryButtonLabel || secondaryButtonLabel) && (
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
            )}
          </>
        )}
      </div>
    </OdsDrawer>
  );
};
