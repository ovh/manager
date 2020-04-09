export default class DomainDnsAnycastConfirmTerminateCtrl {
  /* @ngInject */
  constructor($state, Domain) {
    this.$state = $state;
    this.Domain = Domain;
    this.loading = false;
  }

  confirm() {
    this.loading = true;
    return this.Domain.terminateDnsAnycast(this.domainName)
      .then(() => this.goBack())
      .finally(() => {
        this.goBack();
        this.loading = false;
      });
  }
}
