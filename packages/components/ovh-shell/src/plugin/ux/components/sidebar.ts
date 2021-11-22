import uxComponent, { IUxComponent } from './component';

export type ISidebar = IUxComponent;

const Sidebar = (): ISidebar => {
  return uxComponent({ visible: false });
};

export default Sidebar;
