import { useState } from 'react';

import { clsx } from 'clsx';

import { DrawerCollapseState } from '../Drawer.types';
import { DrawerBase } from '../drawer-base/DrawerBase.component';
import DrawerHandle from '../drawer-handle/DrawerHandle.component';
import { DrawerRootCollapsibleProps } from './DrawerRootCollapsible.props';

export const DrawerRootCollapsible = ({ isOpen = true, ...props }: DrawerRootCollapsibleProps) => {
  const [collapseState, setCollapseState] = useState<DrawerCollapseState>('visible');

  const handleToggleCollapseState = () => {
    setCollapseState((prevState) => (prevState === 'visible' ? 'collapsed' : 'visible'));
  };

  return (
    <div id="mrc-drawer" className="relative">
      <DrawerBase
        isOpen={isOpen}
        createPortal={false}
        {...props}
        className={clsx(
          'transition-all duration-(--mrc-drawer-collapse-duration) ease-in-out',
          'mrc-drawer-handle-fade-in',
          collapseState === 'collapsed' && 'translate-x-(--mrc-drawer-width)',
        )}
      />

      {isOpen && <DrawerHandle onClick={handleToggleCollapseState} collapseState={collapseState} />}
    </div>
  );
};
