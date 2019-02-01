import map from 'lodash/map';

export default class {
  /* @ngInject */
  constructor(
    OvhApiPackXdslExchangeLite,
  ) {
    this.OvhApiPackXdslExchangeLite = OvhApiPackXdslExchangeLite;
  }

  $onInit() {
    this.details = this.service;
    this.services = [];

    this.loading = true;

    // Get service link to this access from current Pack Xdsl
    return this.OvhApiPackXdslExchangeLite
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
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
