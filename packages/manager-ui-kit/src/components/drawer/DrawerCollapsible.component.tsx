import { useState } from 'react';
import clsx from 'clsx';
import DrawerHandle from './DrawerHandle.component';
import { DrawerBase, DrawerBaseProps } from './DrawerBase.component';
import { DrawerCollapseState } from './Drawer.types';
import './translations';

export type DrawerCollapsibleProps = Omit<DrawerBaseProps, 'className'>;

export const DrawerCollapsible = (props: DrawerCollapsibleProps) => {
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
        {...props}
        className={clsx(
          '[&::part(drawer)]:duration-[var(--mrc-drawer-collapse-duration)]',
          '[&::part(drawer)]:ease-in-out',
          collapseState === 'collapsed' &&
            '[&::part(drawer)]:translate-x-[var(--mrc-drawer-width)]',
        )}
      />

      {props.isOpen && (
        <DrawerHandle
          onClick={handleToggleCollapseState}
          collapseState={collapseState}
        />
      )}
    </div>
  );
};
