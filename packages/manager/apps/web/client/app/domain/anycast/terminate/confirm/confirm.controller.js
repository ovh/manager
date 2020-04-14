export default class DomainDnsAnycastConfirmTerminateCtrl {
  /* @ngInject */
  constructor(Domain) {
    this.Domain = Domain;
    this.loading = false;
  }

  confirm() {
    this.loading = true;
    return this.Domain.terminateDnsAnycast(this.domainName)
      .then(() => this.goBack())
      .catch((err) => this.setError(err.message))
      .finally(() => {
        this.goBack();
        this.loading = false;
      });
  }
}
