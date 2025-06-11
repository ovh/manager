import { useState } from 'react';
import DrawerHandle from './DrawerHandle.component';
import { DrawerBase, DrawerBaseProps } from './DrawerBase.component';
import { DrawerCollapseState } from './Drawer.types';
import './translations';

export type DrawerCollapsibleProps = Omit<DrawerBaseProps, 'className'>;

export const DrawerCollapsible = (props: DrawerCollapsibleProps) => {
  const [collapseState, setCollapsedState] =
    useState<DrawerCollapseState>('visible');

  const handleToggleCollapseState = () => {
    setCollapsedState((prevState) =>
      prevState === 'visible' ? 'hidden' : 'visible',
    );
  };

  return (
    <div className="relative bg-transparent">
      <DrawerBase
        {...props}
        className={
          collapseState === 'hidden' && `[&::part(drawer)]:translate-x-[456px]`
        }
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
