import { useEffect, useState } from 'react';

import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

import { BUTTON_COLOR, BUTTON_VARIANT, ICON_NAME, Icon } from '@ovhcloud/ods-react';

import { Button } from '@/components/button/Button.component';
import { DrawerHandleProps } from '@/components/drawer/drawer-handle/DrawerHandle.props';

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
        'fixed z-100 top-(--mrc-drawer-header-height) right-(--mrc-drawer-width)',
        'transition-all duration-(--mrc-drawer-collapse-duration) ease-in-out',
        'mrc-drawer-handle-fade-in',
        hasEscapeBeenPressed && 'hidden',
        collapseState === 'collapsed' && 'translate-x-(--mrc-drawer-width)',
      )}
    >
      <div
        className={clsx(
          'w-(--mrc-drawer-handle-size) h-(--mrc-drawer-handle-size)',
          'right-0 bg-white',
          'rounded-l-lg justify-center items-center',
          'mrc-drawer-handle-shadow',
          // Hide the handle on small screens when the drawer becomes w-full
          collapseState === 'visible' ? 'hidden sm:flex' : 'flex',
        )}
      >
        <div>
          <Button
            data-testid="drawer-handle"
            aria-label={collapseState === 'visible' ? t('collapse') : t('expand')}
            onClick={onClick}
            color={BUTTON_COLOR.primary}
            variant={BUTTON_VARIANT.ghost}
          >
            <Icon
              name={
                collapseState === 'visible'
                  ? ICON_NAME.chevronDoubleRight
                  : ICON_NAME.chevronDoubleLeft
              }
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DrawerHandle;
