import map from 'lodash/map';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $stateParams,
    TucToast,
    OvhApiPackXdslHostedEmail,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.$stateParams = $stateParams;
    this.TucToast = TucToast;
    this.OvhApiPackXdslHostedEmail = OvhApiPackXdslHostedEmail;
  }

  $onInit() {
    this.services = [];
    this.loading = false;

    return this.loadServices();
  }

  loadServices() {
    this.loading = true;

    return this.OvhApiPackXdslHostedEmail
      .v6()
      .query({
        packId: this.pack.packName,
      })
      .$promise
      .then((services) => {
        this.services = map(services, service => ({
          name: service,
          domain: service.replace(/^.+\./, '.'),
        }));
        return this.services;
      })
      .catch((err) => {
        this.TucToast.error(this.$translate.instant('hosted_email_loading_error'));
        return this.$q.reject(err);
      }).finally(() => {
        this.loading = false;
      });
  }
}
