import { DrawerCollapseState } from '../Drawer.types';

export type DrawerHandleProps = {
  onClick: () => void;
  collapseState: DrawerCollapseState;
};
