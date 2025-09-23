import { useEffect, useState } from 'react';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { DrawerHandleProps } from './DrawerHandle.props';
import '../translations';

const DrawerHandle = ({ onClick, collapseState }: DrawerHandleProps) => {
  const { t } = useTranslation('drawer');
  const [hasEscapeBeenPressed, setHasEscapeBeenPressed] = useState(false);

  // Handle Escape key press to hide the handle
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && collapseState === 'visible') {
        setHasEscapeBeenPressed(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [collapseState]);

  return (
    <div
      className={clsx(
        'fixed z-[100] top-[var(--mrc-drawer-header-height)] right-[var(--mrc-drawer-width)]',
        'transition-all duration-[var(--mrc-drawer-collapse-duration)] ease-in-out',
        'mrc-drawer-handle-fade-in',
        hasEscapeBeenPressed && 'hidden',
        collapseState === 'collapsed' &&
          'translate-x-[var(--mrc-drawer-width)]',
      )}
    >
      <div
        className={clsx(
          'w-[var(--mrc-drawer-handle-size)] h-[var(--mrc-drawer-handle-size)]',
          'right-0 bg-white',
          'rounded-l-lg justify-center items-center',
          'mrc-drawer-handle-shadow',
          // Hide the handle on small screens when the drawer becomes w-full
          collapseState === 'visible' ? 'hidden sm:flex' : 'flex',
        )}
      >
        <div>
          <OdsButton
            data-testid="drawer-handle"
            label={undefined}
            aria-label={
              collapseState === 'visible' ? t('collapse') : t('expand')
            }
            icon={
              collapseState === 'visible'
                ? 'chevron-double-right'
                : 'chevron-double-left'
            }
            onClick={onClick}
            color={ODS_BUTTON_COLOR.primary}
            variant={ODS_BUTTON_VARIANT.ghost}
          />
        </div>
      </div>
    </div>
  );
};

export default DrawerHandle;
