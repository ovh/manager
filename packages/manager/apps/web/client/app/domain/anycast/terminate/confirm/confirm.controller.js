export default class DomainDnsAnycastConfirmTerminateCtrl {
  /* @ngInject */
  constructor(Domain) {
    this.Domain = Domain;
    this.loading = false;
  }

  confirm() {
    this.loading = true;
    return this.Domain.terminateDnsAnycast(this.domainName, {
      automatic: true,
      deleteAtExpiration: true,
      forced: false,
    })
      .then(() => this.goBack())
      .catch((err) => this.setError(err?.data?.message))
      .finally(() => {
        this.goBack();
        this.loading = false;
      });
  }
}
