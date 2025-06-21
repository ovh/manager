import DrawerBackdrop from './DrawerBackdrop.component';
import { DrawerBase, DrawerBaseProps } from './DrawerBase.component';
import './translations';

export type DrawerProps = Omit<DrawerBaseProps, 'className'>;

export const Drawer = (props: DrawerProps) => {
  return (
    <div id="mrc-drawer" className="relative">
      <DrawerBase {...props} />
      {props.isOpen && <DrawerBackdrop onClick={props.onDismiss} />}
    </div>
  );
};
