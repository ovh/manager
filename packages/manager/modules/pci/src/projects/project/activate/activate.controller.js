import illustration from './assets/activate-bg.png';

export default class {
  /* @ngInject */
  constructor($q, orderCart, pciProjectNew) {
    this.$q = $q;
    this.orderCart = orderCart;
    this.pciProjectNew = pciProjectNew;
    this.illustration = illustration;
  }

  onActivateProjectClick() {
    this.goToProjectDashboard();
  }
}
