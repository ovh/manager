import illustration from './assets/activate-bg.png';

export default class ProjectActivateController {
  /* @ngInject */
  constructor($q, orderCart, pciProjectNew) {
    this.$q = $q;
    this.orderCart = orderCart;
    this.pciProjectNew = pciProjectNew;
    this.illustration = illustration;
  }

  onActivateProjectClick() {
    return this.goToProjectDashboard();
  }
}
