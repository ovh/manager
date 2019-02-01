import map from 'lodash/map';

export default class {
  /* @ngInject */
  constructor(
    OvhApiPackXdslExchangeIndividual,
  ) {
    this.OvhApiPackXdslExchangeIndividual = OvhApiPackXdslExchangeIndividual;
  }

  $onInit() {
    this.details = this.service;
    this.services = [];

    this.loading = false;

    // Get service link to this access from current Pack Xdsl
    return this.OvhApiPackXdslExchangeIndividual
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
      .finnaly(() => {
        this.loading = false;
      });
  }
}
