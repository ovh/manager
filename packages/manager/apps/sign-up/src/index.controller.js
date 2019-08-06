export default class SignUpCtrl {
  /* @ngInject */
  constructor($window) {
    this.$window = $window;
  }

  $onInit() {
    this.logoUrl = this.$window.location.href;
  }
}
