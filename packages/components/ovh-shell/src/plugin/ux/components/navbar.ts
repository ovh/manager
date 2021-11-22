import uxComponent, { IUxComponent } from './component';

export interface INavbar extends IUxComponent {
  selectedUniverse?: string;
}

const Navbar = (): INavbar => {
  return uxComponent({ visible: true });
};

export default Navbar;
