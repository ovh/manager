import { SidebarElement } from './SidebarElement';

export class Sidebar {
  items: SidebarElement[];

  constructor(items: SidebarElement[]) {
    this.items = items;
  }
}

export default Sidebar;
