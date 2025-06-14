import DrawerBackdrop from './DrawerBackdrop.component';
import { DrawerBase, DrawerBaseProps } from './DrawerBase.component';
import './translations';

export type DrawerProps = Omit<DrawerBaseProps, 'className'>;

export const Drawer = (props: DrawerProps) => {
  return (
    <div className="relative bg-transparent">
      <DrawerBase {...props} />
      {props.isOpen && <DrawerBackdrop onClick={props.onDismiss} />}
    </div>
  );
};
