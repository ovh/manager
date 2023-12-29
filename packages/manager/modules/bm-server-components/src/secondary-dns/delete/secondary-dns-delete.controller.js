export default class DeleteSecondaryDnsCtrl {
  /* @ngInject */
  constructor($translate, Server) {
    this.$translate = $translate;
    this.Server = Server;
  }

  deleteSecondaryDns() {
    this.loadingDelete = true;
    return this.Server.deleteSecondaryDns(this.server.name, this.domain)
      .then(() => {
        this.goBack(
          this.$translate.instant('server_delete_secondary_dns_success', {
            t0: this.domain,
          }),
          'success',
          true,
        );
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant('server_delete_secondary_dns_fail', {
            t0: this.domain,
          })} ${err?.message}`,
          'danger',
        );
      });
  }
}
