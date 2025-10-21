import DrawerBackdrop from '../drawer-backdrop/DrawerBackdrop.component';
import { DrawerBase } from '../drawer-base/DrawerBase.component';
import { DrawerRootProps } from './DrawerRoot.props';

export const DrawerRoot = ({
  createPortal = false,
  trigger = null,
  isOpen = true,
  ...props
}: DrawerRootProps) => {
  return (
    <div id="mrc-drawer" className="relative">
      <DrawerBase createPortal={createPortal} isOpen={isOpen} trigger={trigger} {...props} />
      {isOpen && <DrawerBackdrop onClick={props.onDismiss} />}
    </div>
  );
};
