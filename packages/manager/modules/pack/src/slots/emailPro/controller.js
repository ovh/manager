import map from 'lodash/map';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    OvhApiPackXdslEmailPro,
    TucToast,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiPackXdslEmailPro = OvhApiPackXdslEmailPro;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.services = [];
    this.lodaing = false;

    this.loadServices();
  }

  loadServices() {
    this.loading = true;
    return this.OvhApiPackXdslEmailPro.v6().query({ packName: this.pack.packName })
      .$promise
      .then((services) => {
        this.services = map(services, service => ({
          name: service,
          domain: service.replace(/^.+\./, '.'),
        }));
        return this.services;
      })
      .catch((err) => {
        this.TucToast.error(this.$translate.instant('email_pro_loading_error'));
        return this.$q.reject(err);
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
