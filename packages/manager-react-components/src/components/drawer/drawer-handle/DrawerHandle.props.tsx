import { DrawerCollapseState } from '../drawer.types';

export type DrawerHandleProps = {
  onClick: () => void;
  collapseState: DrawerCollapseState;
};
