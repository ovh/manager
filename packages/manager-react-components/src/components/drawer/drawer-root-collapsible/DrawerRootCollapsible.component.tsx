import { useState } from 'react';
import clsx from 'clsx';
import DrawerHandle from '../drawer-handle/DrawerHandle.component';
import { DrawerBase } from '../drawer-base/DrawerBase.component';
import { DrawerCollapseState } from '../drawer.types';
import { DrawerRootCollapsibleProps } from './DrawerRootCollapsible.props';

export const DrawerRootCollapsible = ({
  isOpen = true,
  ...props
}: DrawerRootCollapsibleProps) => {
  const [collapseState, setCollapseState] =
    useState<DrawerCollapseState>('visible');

  const handleToggleCollapseState = () => {
    setCollapseState((prevState) =>
      prevState === 'visible' ? 'collapsed' : 'visible',
    );
  };

  return (
    <div id="mrc-drawer" className="relative">
      <DrawerBase
        isOpen={isOpen}
        {...props}
        className={clsx(
          '[&::part(drawer)]:duration-[var(--mrc-drawer-collapse-duration)]',
          '[&::part(drawer)]:ease-in-out',
          collapseState === 'collapsed' &&
            '[&::part(drawer)]:translate-x-[var(--mrc-drawer-width)]',
        )}
      />

      {isOpen && (
        <DrawerHandle
          onClick={handleToggleCollapseState}
          collapseState={collapseState}
        />
      )}
    </div>
  );
};
