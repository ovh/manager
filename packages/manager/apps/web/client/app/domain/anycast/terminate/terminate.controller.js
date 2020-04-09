export default class DomainDnsAnycastTerminateCtrl {
  /* @ngInject */
  constructor($state) {
    this.$state = $state;
  }

  terminate() {
    return this.$state.go(
      'app.domain.product.anycast-terminate.confirm-terminate',
    );
  }
}
