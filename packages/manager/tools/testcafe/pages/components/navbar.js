import { Selector } from 'testcafe';

class Navbar {
  constructor() {
    this.navbar = Selector('.oui-navbar');
  }
}

export default new Navbar();
