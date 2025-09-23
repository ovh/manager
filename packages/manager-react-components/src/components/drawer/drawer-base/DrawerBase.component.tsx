import {
  OdsButton,
  OdsDrawer,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_SPINNER_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { DrawerBaseProps } from './DrawerBase.props';
import '../translations';

export const DrawerBase = ({
  children,
  isOpen,
  isLoading,
  onDismiss,
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
        '[&::part(drawer)]:w-full [&::part(drawer)]:sm:w-[var(--mrc-drawer-width)] [&::part(drawer)]:max-w-full [&::part(drawer)]:p-0 [&::part(drawer)]:overflow-hidden',
        className,
      )}
    >
      <div className="h-screen overflow-hidden flex flex-col justify-between">
        <OdsButton
          data-testid="drawer-dismiss-button"
          label=""
          aria-label={t('close')}
          icon="xmark"
          onClick={onDismiss}
          color={ODS_BUTTON_COLOR.primary}
          variant={ODS_BUTTON_VARIANT.ghost}
          className="absolute top-7 right-4"
        />

        {isLoading && (
          <div
            data-testid="drawer-spinner"
            className="h-full flex justify-center items-center"
          >
            <OdsSpinner size={ODS_SPINNER_SIZE.md}></OdsSpinner>
          </div>
        )}

        {!isLoading && children}
      </div>
    </OdsDrawer>
  );
};
