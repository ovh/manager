import { useEffect, useState } from 'react';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import clsx from 'clsx';
import { DrawerCollapseState } from './Drawer.types';

type DrawerHandleProps = {
  onClick: () => void;
  collapseState: DrawerCollapseState;
};

const DrawerHandle = ({ onClick, collapseState }: DrawerHandleProps) => {
  const [isDrawerSlideInFinished, setIsDrawerSlideInFinished] = useState(false);
  const [hasEscapeBeenPressed, setHasEscapeBeenPressed] = useState(false);

  // Wait for the drawer to slide in before showing the handle with a fade-in effect
  // This is to ensure the handle is not visible during the initial slide-in animation
  useEffect(() => {
    const timer = setTimeout(() => setIsDrawerSlideInFinished(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Handle Escape key press to hide the handle
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && collapseState === 'visible') {
        setHasEscapeBeenPressed(true);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [collapseState]);

  return (
    <div
      className={clsx(
        'fixed z-[100] top-[100px] right-[456px] transition-all duration-300 ease-in-out',
        isDrawerSlideInFinished ? 'opacity-100' : 'opacity-0',
        hasEscapeBeenPressed && 'hidden',
        collapseState === 'hidden' && 'translate-x-[456px]',
      )}
    >
      <div
        className={clsx(
          'right-0 w-[56px] h-[56px] bg-white',
          'rounded-l-lg absolute justify-center items-center',
          // Hide the handle on small screens to avoid design issues
          collapseState === 'visible' ? 'hidden sm:flex' : 'flex',
        )}
        style={{
          // Apply ODS Drawer shadow style
          boxShadow: 'rgba(0, 14, 156, 0.2) 0px 2px 8px 0px',
          // Remove shadow on right side to avoid overlap with the drawer
          clipPath: 'inset(-15px 0px -15px -15px)',
        }}
      >
        <div>
          <OdsButton
            data-testid="drawer-handle"
            label={undefined}
            aria-label={
              collapseState === 'visible' ? 'Hide drawer' : 'Show drawer'
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
