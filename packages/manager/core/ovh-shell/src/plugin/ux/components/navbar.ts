import { UXComponent, IUxComponent } from './component';

export interface INavbar extends IUxComponent {
  selectedUniverse?: string;
}

const Navbar = (): INavbar => {
  return new UXComponent({ visible: true });
};

export default Navbar;
