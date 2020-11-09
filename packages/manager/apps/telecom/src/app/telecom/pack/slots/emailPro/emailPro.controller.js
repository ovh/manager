import map from 'lodash/map';

export default class PackEmailProCtrl {
  /* @ngInject */
  constructor($q, $stateParams, $translate, OvhApiPackXdslEmailPro, TucToast) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.OvhApiPackXdslEmailPro = OvhApiPackXdslEmailPro;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.services = [];
    this.loaders = {};

    this.loadServices();
  }

  loadServices() {
    this.loaders.services = true;
    return this.OvhApiPackXdslEmailPro.v6()
      .query({ packName: this.$stateParams.packName })
      .$promise.then((services) => {
        this.services = map(services, (service) => ({
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
        this.loaders.services = false;
      });
  }
}
